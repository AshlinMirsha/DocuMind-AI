import { useState, useRef, useEffect, type FormEvent } from 'react';
import { askQuestion, type Source } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface ChatWindowProps {
  documentId: string;
}

export default function ChatWindow({ documentId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentQuestion = question.trim();

    if (!currentQuestion || loading) return;

    setMessages(previous => [
      ...previous,
      { role: 'user', content: currentQuestion }
    ]);

    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const result = await askQuestion(documentId, currentQuestion);

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          content: result.answer,
          sources: result.sources
        }
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-window">

      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-icon">✦</div>

        <div>
          <h2>Document Assistant</h2>
          <p>Ask questions and explore your PDF</p>
        </div>

        <span className="online-status">
          <span></span> AI Ready
        </span>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">

        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="welcome-icon">✦</div>

            <h3>What would you like to know?</h3>

            <p>
              Your document is ready. Ask me anything about its
              contents, and I'll help you find the answer.
            </p>

            <div className="suggestion-label">
              START WITH A QUESTION
            </div>

            <div className="suggestion-list">
              <button
                type="button"
                onClick={() => setQuestion('Summarize this document')}
              >
                Summarize this document
              </button>

              <button
                type="button"
                onClick={() => setQuestion('What are the main topics?')}
              >
                What are the main topics?
              </button>

              <button
                type="button"
                onClick={() => setQuestion('Explain the important points')}
              >
                Explain the important points
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${message.role}`}
          >
            {message.role === 'assistant' && (
              <div className="message-avatar">✦</div>
            )}

            <div className="message-content">
              <span className="message-sender">
                {message.role === 'user' ? 'You' : 'DocuMind AI'}
              </span>

              <div className="message-bubble">
                <p>{message.content}</p>

                {message.sources && message.sources.length > 0 && (
                  <div className="sources">
                    <span className="sources-title">
                      Sources from your PDF
                    </span>

                    <div className="source-list">
                      {message.sources.map((source, sourceIndex) => (
                        <span key={sourceIndex} className="source-tag">
                          Page {source.page}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="user-avatar">M</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-row assistant">
            <div className="message-avatar">✦</div>

            <div className="message-content">
              <span className="message-sender">DocuMind AI</span>

              <div className="message-bubble typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="chat-input">

        <input
          type="text"
          placeholder="Message DocuMind AI..."
          value={question}
          onChange={event => setQuestion(event.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!question.trim() || loading}
          aria-label="Send message"
        >
          ➤
        </button>

      </form>

      <p className="chat-footer">
        DocuMind AI can make mistakes. Verify important information with your document.
      </p>

    </div>
  );
}