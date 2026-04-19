import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

const isStandardApiResponse = (payload) => {
    return payload && typeof payload === 'object' && typeof payload.success !== 'undefined'
}

api.interceptors.request.use((config) => {
    const token = config.token || config.headers?.Authorization
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: typeof token === 'string' && token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        }
    }
    delete config.token
    return config
})

api.interceptors.response.use(
    (response) => {
        const res = response.data

        if (!isStandardApiResponse(res)) {
            throw new Error('Invalid API response format')
        }

        if (!res.success) {
            const error = res.error || {}
            return Promise.reject({
                code: error.code || 'API_ERROR',
                message: error.message || res.message || 'Request failed',
                retryable: error.retryable || false,
                details: error.details || null,
                meta: res.meta || null,
                status: response.status,
            })
        }

        return {
            data: res.data,
            meta: res.meta,
            message: res.message,
            ...(res.pagination ? { pagination: res.pagination } : {}),
        }
    },
    (error) => {
        if (error.response?.data && isStandardApiResponse(error.response.data)) {
            const res = error.response.data
            const err = res.error || {}
            return Promise.reject({
                code: err.code || 'API_ERROR',
                message: err.message || res.message || 'Request failed',
                retryable: err.retryable || false,
                details: err.details || null,
                meta: res.meta || null,
                status: error.response.status,
            })
        }

        return Promise.reject({
            code: 'NETWORK_ERROR',
            message: error.message || 'Network request failed',
            retryable: false,
            status: error.response?.status || null,
            details: error.response?.data || null,
        })
    }
)

const buildHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

export const request = async (path, { method = 'GET', body, token, params, raw = false } = {}) => {
    const response = await api.request({
        url: path,
        method,
        headers: buildHeaders(token),
        params,
        data: body,
    })

    return raw ? response : response.data
}

export default api
