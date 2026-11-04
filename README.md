# 🧠 DocuMind AI
### AI-Powered PDF Question Answering System

DocuMind AI is an intelligent document assistant that allows users to upload PDF documents and interact with their content using natural language.

Instead of manually searching through lengthy documents, users can simply ask questions and receive relevant, context-aware answers generated using Large Language Models (LLMs).

Built using **Retrieval-Augmented Generation (RAG)**, DocuMind AI combines semantic search, vector embeddings, and generative AI to make document understanding faster and easier.

---

## 🚀 Features

- 📄 **PDF Upload** – Upload PDF documents through an interactive interface.
- 📝 **Text Extraction** – Extract text from PDF documents using PyMuPDF.
- ✂️ **Text Chunking** – Divide extracted text into smaller, manageable chunks.
- 🧠 **Text Embeddings** – Convert document text into numerical vectors.
- 🔍 **Semantic Search** – Retrieve relevant information based on meaning.
- 💬 **AI Question Answering** – Ask questions and receive context-aware answers.
- 📚 **Source References** – Identify the PDF pages used to generate answers.
- 🔒 **Local AI Processing** – Run language and embedding models locally using Ollama.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe frontend development |
| Vite | Frontend development server |
| Python | Backend programming |
| Flask | REST API development |
| PyMuPDF | PDF text extraction |
| Ollama | Local AI model execution |
| Llama 3.1 | Answer generation |
| nomic-embed-text | Text embedding generation |
| ChromaDB | Vector database |

---

## 🏗️ System Architecture

```text
             USER
               |
               v
       REACT FRONTEND
         (TypeScript)
               |
               | HTTP Requests
               v
        FLASK BACKEND
               |
       +-------+-------+
       |               |
       v               v
   PDF PROCESSING   USER QUESTION
       |               |
       v               v
   PyMuPDF       Ollama Embedding
       |               |
       v               v
   Text Chunking   Query Vector
       |               |
       v               |
   Ollama Embedding    |
       |               |
       v               v
         CHROMADB
       Vector Search
               |
               v
       Relevant Chunks
               |
               v
        LLAMA 3.1
               |
               v
       GENERATED ANSWER
               |
               v
        REACT FRONTEND
```

---

## 🔄 How It Works

### 1. PDF Upload
The user uploads a PDF document through the React frontend.

### 2. Text Extraction
The Flask backend uses PyMuPDF to extract text from the uploaded PDF.

### 3. Text Chunking
The extracted text is divided into smaller chunks to improve retrieval accuracy.

### 4. Embedding Generation
The `nomic-embed-text` model converts each text chunk into a numerical vector representation.

### 5. Vector Storage
The generated embeddings, text chunks, and document metadata are stored in ChromaDB.

### 6. Question Processing
When the user asks a question, the backend generates an embedding for the question.

### 7. Semantic Retrieval
ChromaDB searches for the most relevant document chunks using vector similarity.

### 8. Answer Generation
The retrieved context and user question are sent to the Llama 3.1 model through Ollama.

### 9. Response Display
The generated answer and relevant source references are returned to the React frontend.

---

## 📂 Project Structure

```text
DocuMind_AI/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── fileupload.tsx
│   │   │   └── chatwindow.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── style.css
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Python
- Node.js and npm
- Ollama
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd DocuMind_AI
```

### 2. Set Up the Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3.1
OLLAMA_EMBED_MODEL=nomic-embed-text
```

### 4. Download Ollama Models

```bash
ollama pull llama3.1
ollama pull nomic-embed-text
```

Make sure the Ollama service is running.

### 5. Start the Backend

```bash
python app.py
```

Backend runs at:

```text
http://localhost:5000
```

### 6. Set Up the Frontend

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload and process a PDF |
| POST | `/api/chat` | Ask questions about an uploaded PDF |

---

## 🎯 Project Objective

The objective of DocuMind AI is to simplify document understanding and information retrieval by combining semantic search and generative AI.

It aims to reduce manual document searching and provide users with an interactive way to explore information contained in PDF files.

---

## 🔮 Future Enhancements

- Support for multiple document formats.
- Conversation history.
- Multiple PDF document comparison.
- Improved source citations.
- Streaming AI responses.
- User authentication and document management.

---

## 👩‍💻 Author

**Ashlin Mirsha R K**

B.Tech Computer Science and Engineering

Karunya Institute of Technology and Sciences

---

⭐ If you find this project interesting, consider giving it a star!