import { portfolioApiUrl } from './portfolioApi'

async function fetchApi(url, options) {
  try {
    return await fetch(url, options)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.',
        { cause: error },
      )
    }
    throw error
  }
}

export async function apiRequest(path, { method = 'GET', body, file, csrf = false } = {}) {
  const headers = { Accept: 'application/json' }
  if (body) headers['Content-Type'] = 'application/json'

  if (csrf) {
    const csrfResponse = await fetchApi(portfolioApiUrl('/admin-api/csrf'), {
      credentials: 'include',
      headers,
    })
    const csrfResult = await csrfResponse.json().catch(() => null)
    if (!csrfResponse.ok || !csrfResult?.csrfToken) {
      throw new Error('Impossible de préparer la session sécurisée.')
    }
    headers['X-CSRF-TOKEN'] = csrfResult.csrfToken
  }

  const response = await fetchApi(portfolioApiUrl(path), {
    method,
    credentials: 'include',
    headers,
    body: file || (body ? JSON.stringify(body) : undefined),
  })
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    const validationMessage = Object.values(result?.errors || {}).flat()[0]
    const fallbackMessage = result
      ? 'Une erreur est survenue. Réessayez.'
      : `Réponse invalide du serveur (${response.status}). Vérifiez que l’API Laravel est disponible.`
    const error = new Error(validationMessage || result?.message || fallbackMessage)
    error.status = response.status
    throw error
  }

  return result
}
