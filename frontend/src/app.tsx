import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import FileUpload from './components/fileupload';
import ChatWindow from './components/chatwindow';
import type { UploadResult } from './services/api';

function App() {
  const [document, setDocument] = useState<UploadResult | null>(null);

  return (
    <main>
      <h1>DocuMind AI</h1>
      {!document ? (
        <FileUpload onUploadSuccess={setDocument} />
      ) : (
        <ChatWindow documentId={document.documentId} />
      )}
    </main>
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