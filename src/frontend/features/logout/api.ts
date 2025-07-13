export async function logout(): Promise<void> {
  const response = await fetch('/api/v1/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Logout failed');
  }
}
