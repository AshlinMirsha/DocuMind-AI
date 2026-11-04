import type { Source } from '../services/api';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export default function Message({
  role,
  content,
  sources = []
}: MessageProps) {

  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>

      <div className="message-avatar">
        {isUser ? 'You' : 'AI'}
      </div>

      <div className="message-content">

        <div className="message-sender">
          {isUser ? 'You' : 'DocuMind AI'}
        </div>

        <p>{content}</p>

        {!isUser && sources.length > 0 && (
          <div className="message-sources">

            <strong>PDF Sources:</strong>

            {sources.map((source, index) => (
              <span key={`${source.page}-${index}`}>
                Page {source.page}
              </span>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}