const API_BASE = 'http://localhost:8000/api/v1'

const buildHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

const parseResponse = async (response) => {
    const result = await response.json()

    if (!response.ok) {
        const message = result?.message || result?.data?.message || result?.errors?.[0] || 'Server returned an error'
        throw new Error(message)
    }

    if (result?.success === false) {
        const message = result?.message || result?.errors?.[0] || 'Request failed'
        throw new Error(message)
    }

    return result
}

export const request = async (path, { method = 'GET', body, token, raw = false } = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers: buildHeaders(token),
        body: body ? JSON.stringify(body) : undefined,
    })

    const result = await parseResponse(response)
    return raw ? result : result.data
}
