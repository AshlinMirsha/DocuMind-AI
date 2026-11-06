const API_BASE_URL = 'http://127.0.0.1:5000';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user?: AuthUser;
  access_token?: string;
  refresh_token?: string;
  confirmation_required?: boolean;
}

async function getErrorMessage(response: Response): Promise<string> {
  const data = await response.json().catch(() => null);

  return data?.error || `Request failed with status ${response.status}`;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}