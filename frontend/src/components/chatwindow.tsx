import { useState, type FormEvent } from 'react';
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

      <div className="chat-header">
        <h2>Chat with your PDF</h2>
        <p>Ask anything about your uploaded document.</p>
      </div>

      <div className="chat-messages">

        {messages.length === 0 && (
          <div className="empty-chat">
            <h3>Welcome to DocuMind AI!</h3>
            <p>Ask your first question about the PDF.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role}`}
          >
            <strong>
              {message.role === 'user' ? 'You' : 'DocuMind AI'}
            </strong>

            <p>{message.content}</p>

            {message.sources && (
              <div className="sources">
                <strong>Sources:</strong>

                {message.sources.map((source, sourceIndex) => (
                  <span key={sourceIndex}>
                    Page {source.page}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="loading-message">
            AI is thinking...
          </div>
        )}

      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="chat-input">

        <input
          type="text"
          placeholder="Ask a question about your PDF..."
          value={question}
          onChange={event => setQuestion(event.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!question.trim() || loading}
        >
          Send
        </button>

      </form>

    </div>
  );
}