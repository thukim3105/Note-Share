import api from './client.js'

const buildAuthConfig = (token) => {
    if (!token) return {}

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}

const cleanParams = (params = {}) => {
    return Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value
        }
        return acc
    }, {})
}

const normalizeList = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData
    }

    if (Array.isArray(responseData?.users)) {
        return responseData.users
    }

    if (Array.isArray(responseData?.items)) {
        return responseData.items
    }

    if (Array.isArray(responseData?.results)) {
        return responseData.results
    }

    return []
}

export const loginAdmin = async (payload) => {
    const response = await api.post('/admin/auth/login', payload)
    return response.data
}

export const getUsers = async (filters = {}, token) => {
    const response = await api.get('/admin/users', {
        params: cleanParams(filters),
        ...buildAuthConfig(token),
    })

    return {
        users: normalizeList(response.data),
        meta: response.meta,
        pagination: response.meta?.pagination || response.pagination || null,
    }
}

export const createUser = async (payload, token) => {
    await api.post('/admin/users', payload, buildAuthConfig(token))
}

export const updateUser = async (userId, payload, token) => {
    await api.put(`/admin/users/${userId}`, payload, buildAuthConfig(token))
}

export const deleteUser = async (userId, token) => {
    await api.delete(`/admin/users/${userId}`, buildAuthConfig(token))
}

export const restoreUser = async (userId, token) => {
    await api.post(`/admin/users/${userId}/restore`, null, buildAuthConfig(token))
}

export const bulkDeleteUsers = async (userIds, token) => {
    await api.delete('/admin/users', {
        data: { user_ids: userIds },
        ...buildAuthConfig(token),
    })
}

export const bulkCreateUsers = async (users, token) => {
    await api.post('/admin/users/bulk/create', { users }, buildAuthConfig(token))
}

export const bulkUpdateUsers = async (users, token) => {
    await api.put('/admin/users/bulk/update', { users }, buildAuthConfig(token))
}
