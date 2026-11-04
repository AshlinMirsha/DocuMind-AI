
import os
import uuid
import requests
import pymupdf
import chromadb

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024

documents = {}

# Retrieves value from .env

# Ollama configuration
OLLAMA_URL = os.getenv("OLLAMA_URL")
CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL")


@app.route("/api/upload", methods=["POST"])
def upload_pdf():

    uploaded_file = request.files.get("file")

    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({"error": "A PDF file is required"}), 400

    if not uploaded_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        document = pymupdf.open(stream=uploaded_file.read(), filetype="pdf")
        page_count = len(document)
        document_text = "\n\n".join(page.get_text() for page in document)
        document.close()
    except pymupdf.FileDataError:
        return jsonify({"error": "The uploaded file is not a valid PDF"}), 400

    document_id = str(uuid.uuid4())
    documents[document_id] = {
        "filename": uploaded_file.filename,
        "pages": page_count,
        "text": document_text
    }

    return jsonify({
        "documentId": document_id,
        "filename": uploaded_file.filename,
        "pages": page_count
    }), 201


# We use generate_embedding(text) to convert text into numbers (a numerical vector) so that ChromaDB can understand and search the meaning of the text.
# ChromaDB: Ollama converts text into numbers. ChromaDB stores those numbers and searches for similar meanings.

def generate_embedding(text):

    response = requests.post(
        f"{OLLAMA_URL}/api/embed",
        json={
            "model": EMBED_MODEL,
            "input": text
        },
        timeout=120
    )

    response.raise_for_status()

    return response.json()["embeddings"][0]


# It is used to generate answer for the question

def generate_answer(question):

    response = requests.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": CHAT_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ],
            "stream": False
        },
        timeout=180
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
        "If the answer is not in the text, say that it is not stated in the document.\n\n"
        f"PDF text:\n{context}\n\nQuestion: {question}"
    )

    try:
        answer = generate_answer(prompt)
    except requests.RequestException:
        return jsonify({
            "error": "The AI service is unavailable. Make sure Ollama is running."
        }), 503

    return jsonify({"answer": answer, "sources": []})


# To test whether our embedding model is working correctly

@app.route("/api/embed-test", methods=["POST"])
def embed_test():

    data = request.get_json()

    text = data.get("text", "")

    if not text.strip():

        return jsonify({
            "error": "Text is required"
        }), 400

    embedding = generate_embedding(text)

    return jsonify({
        "message": "Embedding generated successfully",
        "dimensions": len(embedding),
        "embedding": embedding
    })


@app.route("/api/chat-test", methods=["POST"])
def chat_test():

    data = request.get_json()

    question = data.get("question", "")

    if not question.strip():

        return jsonify({
            "error": "Question is required"
        }), 400

    answer = generate_answer(question)

    return jsonify({
        "answer": answer
    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
