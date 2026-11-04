const API_BASE_URL = 'http://127.0.0.1:5000';

export interface Source {
  page: number;
}

export interface UploadResult {
  documentId: string;
  filename: string;
  pages: number;
}

export interface ChatResult {
  answer: string;
  sources?: Source[];
}

async function getErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.error ?? `Request failed with status ${response.status}.`;
}

export async function uploadPdf(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<UploadResult>;
}

export async function askQuestion(
  documentId: string,
  question: string
): Promise<ChatResult> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, question })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json() as Promise<ChatResult>;
}