import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

import FileUpload from './components/fileupload';
import ChatWindow from './components/chatwindow';
import type { UploadResult } from './services/api';

import './style.css';

// LANDING PAGE
function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">D</span>
          DocuMind<span>AI</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <div className="nav-buttons">
          <Link to="/signin" className="signin-link">Sign in</Link>
          <Link to="/signup" className="primary-btn">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          AI-powered document intelligence
        </div>

        <h1>
          Your documents.<br />
          <span>Understood instantly.</span>
        </h1>

        <p className="hero-description">
          Upload your PDFs, ask questions, and get intelligent answers.
          DocuMind AI makes understanding documents simple with AI and OCR technology.
        </p>

        <div className="hero-actions">
          <Link to="/signup" className="primary-btn hero-btn">
            Start for Free <span>→</span>
          </Link>

          <a href="#how-it-works" className="secondary-btn">
            Explore how it works
          </a>
        </div>

        <div className="hero-trust">
          <span>✓</span> Simple document interaction
          <span>✓</span> AI-powered answers
          <span>✓</span> OCR support
        </div>

        <div className="preview-card">
          <div className="preview-header">
            <div className="preview-dots">
              <i></i><i></i><i></i>
            </div>
            <span>DocuMind AI Workspace</span>
            <span className="online-status">● AI Ready</span>
          </div>

          <div className="preview-content">
            <div className="preview-sidebar">
              <div className="preview-sidebar-logo">D</div>
              <div className="preview-sidebar-line active"></div>
              <div className="preview-sidebar-line"></div>
              <div className="preview-sidebar-line"></div>
            </div>

            <div className="preview-main">
              <div className="preview-document">
                <div className="document-icon">PDF</div>
                <div>
                  <strong>Research_Document.pdf</strong>
                  <small>Document uploaded successfully</small>
                </div>
                <span className="success-check">✓</span>
              </div>

              <div className="sample-question">
                <small>YOUR QUESTION</small>
                <p>What are the key findings in this document?</p>
              </div>

              <div className="sample-answer">
                <div className="answer-label">
                  <span className="answer-ai-icon">✦</span>
                  DocuMind AI
                </div>

                <p>
                  The document highlights three important findings.
                  Here is a summary based on the uploaded content...
                </p>

                <div className="answer-lines">
                  <i></i><i></i><i></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-label">FEATURES</span>
          <h2>Everything you need to understand PDFs</h2>
          <p>Powerful tools that make document interaction easier.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon purple">📄</div>
            <h3>PDF Upload</h3>
            <p>Upload your PDF documents and extract their content easily.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">✦</div>
            <h3>AI Question Answering</h3>
            <p>Ask questions and receive answers based on your document.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">⌕</div>
            <h3>OCR Technology</h3>
            <p>Recognize text from scanned and image-based PDF pages.</p>
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Three simple steps</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Upload your PDF</h3>
            <p>Select a document from your device.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h3>Ask your question</h3>
            <p>Type a question about your document.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Get your answer</h3>
            <p>Receive an AI-generated response.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to understand your documents?</h2>
        <p>Start exploring your PDFs with DocuMind AI.</p>
        <Link to="/signup" className="primary-btn">
          Create your account →
        </Link>
      </section>

      <footer className="footer">
        <Link to="/" className="logo">
          <span className="logo-icon">D</span>
          DocuMind<span>AI</span>
        </Link>

        <p>© 2026 DocuMind AI. Built to make documents easier to understand.</p>
      </footer>
    </div>
  );
}


// SIGNUP PAGE
function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    navigate('/signin', {
      state: {
        message: 'Signup form completed. Connect backend authentication to create your account.'
      }
    });
  }

  return (
    <div className="auth-page">
      <Link to="/" className="logo auth-logo">
        <span className="logo-icon">D</span>
        DocuMind<span>AI</span>
      </Link>

      <div className="auth-card">
        <div className="auth-heading">
          <div className="auth-symbol">✦</div>
          <h1>Create your account</h1>
          <p>Start exploring your documents with AI.</p>
        </div>

        <form onSubmit={handleSignup}>
          <label>Full name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Create Account →
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>

        <Link to="/" className="back-home">← Back to home</Link>
      </div>
    </div>
  );
}


// SIGNIN PAGE
function Signin() {
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(
    location.state?.message || ''
  );

  function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(
      'Frontend is ready. Connect the Flask authentication API to verify your account.'
    );
  }

  return (
    <div className="auth-page">
      <Link to="/" className="logo auth-logo">
        <span className="logo-icon">D</span>
        DocuMind<span>AI</span>
      </Link>

      <div className="auth-card">
        <div className="auth-heading">
          <div className="auth-symbol">✦</div>
          <h1>Welcome back</h1>
          <p>Sign in to continue to DocuMind AI.</p>
        </div>

        <form onSubmit={handleSignin}>
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && <p className="form-message">{message}</p>}

          <button type="submit" className="auth-submit">
            Sign In →
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create account</Link>
        </p>

        <Link to="/" className="back-home">← Back to home</Link>
      </div>
    </div>
  );
}


// EXISTING PDF DASHBOARD
function Dashboard() {
  const [document, setDocument] = useState<UploadResult | null>(null);

  return (
    <div className="app-container">

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


// MAIN APP - ROUTING
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
