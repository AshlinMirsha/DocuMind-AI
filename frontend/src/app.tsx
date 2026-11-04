import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FileUpload from './components/fileupload';
import ChatWindow from './components/chatwindow';
import type { UploadResult } from './services/api';
import './style.css';

function App() {
  const [document, setDocument] = useState<UploadResult | null>(null);

  return (
    <div className="app-container">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h2>DocuMind<span> AI</span></h2>
            <p>Intelligent workspace</p>
          </div>
        </div>

        <button
          className="new-chat-btn"
          onClick={() => setDocument(null)}
        >
          <span>＋</span> New conversation
        </button>

        <div className="sidebar-section">
          <p className="section-label">WORKSPACE</p>

          <div className="sidebar-item active">
            <span>▣</span> My Documents
          </div>

          <div className="sidebar-item">
            <span>◷</span> Recent Activity
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="status-indicator"></div>
          <div>
            <p>AI Engine</p>
            <small>Local & Secure</small>
          </div>
          <span className="online-badge">Online</span>
        </div>

      </aside>

      {/* Main Workspace */}
      <main className="main-workspace">

        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace</span>
            <span className="breadcrumb-divider"> / </span>
            <span className="breadcrumb-current">
              {document ? 'Document Chat' : 'Overview'}
            </span>
          </div>

          <div className="topbar-right">
            <span className="secure-label">🔒 Private workspace</span>
            <div className="profile-avatar">M</div>
          </div>
        </header>

        {!document ? (

          <section className="welcome-section">

            <div className="welcome-badge">
              <span className="sparkle">✦</span>
              YOUR AI DOCUMENT ASSISTANT
            </div>

            <h1>
              Your documents.
              <br />
              <span>Now intelligent.</span>
            </h1>

            <p className="welcome-description">
              Upload your PDF documents and have meaningful conversations
              with your content. Find answers, understand complex topics,
              and save valuable time.
            </p>

            <div className="upload-workspace">
              <div className="upload-heading">
                <div>
                  <h2>Start with a document</h2>
                  <p>Upload a PDF to begin your AI-powered conversation.</p>
                </div>
                <span className="pdf-badge">PDF</span>
              </div>

              <FileUpload onUploadSuccess={setDocument} />

              <div className="upload-footer">
                <span>✓ Secure document processing</span>
                <span>✓ AI-powered search</span>
                <span>✓ Context-aware answers</span>
              </div>
            </div>

            <div className="features-grid">

              <div className="feature-card">
                <div className="feature-icon purple">✦</div>
                <h3>Smart Understanding</h3>
                <p>Ask questions and understand your documents naturally.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon blue">⌕</div>
                <h3>Semantic Search</h3>
                <p>Find relevant information based on meaning, not just keywords.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon green">◈</div>
                <h3>Contextual Answers</h3>
                <p>Get responses grounded in your uploaded document.</p>
              </div>

            </div>

          </section>

        ) : (

          <section className="chat-workspace">
            <div className="chat-heading">
              <div>
                <span className="welcome-badge">✦ DOCUMENT ASSISTANT</span>
                <h1>Let's explore your document.</h1>
                <p>Ask questions and discover insights from your PDF.</p>
              </div>

              <button
                className="back-btn"
                onClick={() => setDocument(null)}
              >
                + New document
              </button>
            </div>

            <div className="chat-card">
              <ChatWindow documentId={document.documentId} />
            </div>
          </section>

        )}

      </main>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);