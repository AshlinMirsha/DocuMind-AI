import { useState, type ChangeEvent } from 'react';
import { uploadPdf, type UploadResult } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: (result: UploadResult) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setError('');
    setSuccess('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size must be less than 25 MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {

    if (!file) {
      setError('Please choose a PDF first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadPdf(file);

      setSuccess('PDF uploaded successfully!');
      onUploadSuccess(result);

      setFile(null);

    } catch (err) {

      setError(
        err instanceof Error ? err.message : 'Upload failed.'
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="file-upload">

      <div className="upload-icon">📄</div>

      <h2>Upload Your PDF</h2>

      <p>Select a PDF document to start chatting with AI.</p>

      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
      />

      {file && (
        <p className="selected-file">
          Selected: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Processing PDF...' : 'Upload PDF'}
      </button>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {success && (
        <p className="success-message">{success}</p>
      )}

    </div>
  );
}