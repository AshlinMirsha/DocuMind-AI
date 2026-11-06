import os
import uuid

import chromadb
import pymupdf
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024

documents = {}

OLLAMA_URL = os.getenv("OLLAMA_URL", "").rstrip("/")
CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be configured in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"error": "Enter a valid email address"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters"}), 400

    try:
        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {"data": {"name": name}},
            }
        )

        user = response.user
        session = response.session

        if user is None:
            return jsonify({"error": "Registration could not be completed"}), 400

        return (
            jsonify(
                {
                    "message": (
                        "Account created successfully. Please verify your email."
                        if session is None
                        else "Account created successfully"
                    ),
                    "user": {
                        "id": user.id,
                        "name": name,
                        "email": user.email,
                    },
                    "confirmation_required": session is None,
                }
            ),
            201,
        )
    except Exception as error:
        return jsonify({"error": str(error)}), 400


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        response = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )

        user = response.user
        session = response.session

        if user is None or session is None:
            return jsonify({"error": "Login could not be completed"}), 401

        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "name": user.user_metadata.get("name", ""),
                        "email": user.email,
                    },
                    "access_token": session.access_token,
                    "refresh_token": session.refresh_token,
                }
            ),
            200,
        )
    except Exception:
        return (
            jsonify(
                {
                    "error": (
                        "Invalid email or password. Check your credentials "
                        "or verify your email."
                    )
                }
            ),
            401,
        )


@app.route("/api/upload", methods=["POST"])
def upload_pdf():
    uploaded_file = request.files.get("file")

    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({"error": "A PDF file is required"}), 400

    if not uploaded_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        document = pymupdf.open(
            stream=uploaded_file.read(),
            filetype="pdf",
        )

        page_count = len(document)
        document_text = "\n\n".join(page.get_text() for page in document)
        document.close()
    except pymupdf.FileDataError:
        return jsonify({"error": "The uploaded file is not a valid PDF"}), 400

    document_id = str(uuid.uuid4())
    documents[document_id] = {
        "filename": uploaded_file.filename,
        "pages": page_count,
        "text": document_text,
    }

    return (
        jsonify(
            {
                "documentId": document_id,
                "filename": uploaded_file.filename,
                "pages": page_count,
            }
        ),
        201,
    )


def generate_embedding(text):
    response = requests.post(
        f"{OLLAMA_URL}/api/embed",
        json={"model": EMBED_MODEL, "input": text},
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["embeddings"][0]


def generate_answer(question):
    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": CHAT_MODEL,
            "messages": [{"role": "user", "content": question}],
            "stream": False,
        },
        timeout=180,
    )
    response.raise_for_status()
    return response.json()["message"]["content"]


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}

    document_id = data.get("documentId", "")
    question = data.get("question", "").strip()

    if not document_id or document_id not in documents:
        return jsonify({"error": "The uploaded document was not found"}), 404

    if not question:
        return jsonify({"error": "Question is required"}), 400

    document_text = documents[document_id]["text"]
    context = document_text[:12000]

    prompt = (
        "Answer the question using only the following PDF text. "
        "If the answer is not in the text, say that it is not stated "
        "in the document.\n\n"
        f"PDF text:\n{context}\n\n"
        f"Question: {question}"
    )

    try:
        answer = generate_answer(prompt)
    except requests.RequestException:
        return (
            jsonify(
                {
                    "error": (
                        "The AI service is unavailable. "
                        "Make sure Ollama is running."
                    )
                }
            ),
            503,
        )

    return jsonify({"answer": answer, "sources": []})


@app.route("/api/embed-test", methods=["POST"])
def embed_test():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Text is required"}), 400

    try:
        embedding = generate_embedding(text)
        return jsonify(
            {
                "message": "Embedding generated successfully",
                "dimensions": len(embedding),
                "embedding": embedding,
            }
        )
    except requests.RequestException:
        return jsonify({"error": "Ollama embedding service is unavailable"}), 503


@app.route("/api/chat-test", methods=["POST"])
def chat_test():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "Question is required"}), 400

    try:
        answer = generate_answer(question)
        return jsonify({"answer": answer})
    except requests.RequestException:
        return jsonify({"error": "Ollama chat service is unavailable"}), 503


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )
