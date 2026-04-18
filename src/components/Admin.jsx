import { useCallback, useState } from 'react'
import { request } from '../api/client.js'
import { Button } from './ui/Button.jsx'
import { Card } from './ui/Card.jsx'
import { Divider } from './ui/Divider.jsx'
import { Heading, Label, Text } from './ui/Typography.jsx'
import { InputField } from './ui/InputField.jsx'
import { Badge } from './ui/Badge.jsx'
import { DataTable } from './ui/DataTable.jsx'
import { Modal } from './ui/Modal.jsx'

const extractUsers = (result) => {
    if (!result) {
        return []
    }

    if (Array.isArray(result)) {
        return result
    }

    if (Array.isArray(result.data)) {
        return result.data
    }

    if (Array.isArray(result.data?.users)) {
        return result.data.users
    }

    if (Array.isArray(result.data?.items)) {
        return result.data.items
    }

    if (Array.isArray(result.data?.results)) {
        return result.data.results
    }

    return []
}

export function Admin() {
    const [token, setToken] = useState('')
    const [authForm, setAuthForm] = useState({ username: '', password: '' })
    const [authError, setAuthError] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [users, setUsers] = useState([])
    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])

    const [userForm, setUserForm] = useState({
        email: '',
        name: '',
        password: '',
        position: '',
        avatar_url: '',
        bio: '',
    })

    const [bulkDeleteIds, setBulkDeleteIds] = useState('')
    const [bulkCreateJson, setBulkCreateJson] = useState(
        '[\n  {\n    "email": "user1@example.com",\n    "name": "User One",\n    "password": "Password123"\n  },\n  {\n    "email": "user2@example.com",\n    "name": "User Two"\n  }\n]'
    )
    const [bulkUpdateJson, setBulkUpdateJson] = useState(
        '[\n  {\n    "user_id": 1,\n    "name": "Updated User Name"\n  },\n  {\n    "user_id": 2,\n    "position": "Manager"\n  }\n]'
    )

    const [confirmModal, setConfirmModal] = useState({ open: false, action: '', user: null })

    const requestWithLoading = useCallback(
        async (path, options = {}) => {
            setLoading(true)
            try {
                const tokenValue = options.token ?? token
                return await request(path, { ...options, token: tokenValue })
            } finally {
                setLoading(false)
            }
        },
        [token]
    )

    const fetchUsers = useCallback(
        async (tokenOverride) => {
            try {
                const query = new URLSearchParams()
                if (searchName) query.set('name', searchName)
                if (searchEmail) query.set('email', searchEmail)
                const result = await requestWithLoading(`/admin/users?${query.toString()}`, {
                    token: tokenOverride,
                })
                setUsers(extractUsers(result))
            } catch (error) {
                setStatusMessage(error.message)
            }
        },
        [requestWithLoading, searchEmail, searchName]
    )

    const handleAuthChange = (event) => {
        const { name, value } = event.target
        setAuthForm((prev) => ({ ...prev, [name]: value }))
        setAuthError('')
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        setAuthError('')
        setStatusMessage('')

        if (!authForm.username || !authForm.password) {
            setAuthError('Username and password are required.')
            return
        }

        try {
            const result = await requestWithLoading('/admin/auth/login', {
                method: 'POST',
                body: {
                    username: authForm.username,
                    password: authForm.password,
                },
            })

            const accessToken = result.access_token || result.token

            if (!accessToken) {
                throw new Error('Authentication response did not contain a token.')
            }

            setToken(accessToken)
            setStatusMessage('Admin authenticated. Loading users...')
            await fetchUsers(accessToken)
        } catch (error) {
            setAuthError(error.message)
        }
    }

    const handleFilter = async (event) => {
        event.preventDefault()
        await fetchUsers()
    }

    const handleUserChange = (event) => {
        const { name, value } = event.target
        setUserForm((prev) => ({ ...prev, [name]: value }))
    }

    const selectUser = (user) => {
        setSelectedUser(user)
        setUserForm({
            email: user.email || '',
            name: user.name || '',
            password: '',
            position: user.position || '',
            avatar_url: user.avatar_url || '',
            bio: user.bio || '',
        })
    }

    const clearUserForm = () => {
        setSelectedUser(null)
        setUserForm({ email: '', name: '', password: '', position: '', avatar_url: '', bio: '' })
    }

    const handleUserSave = async (event) => {
        event.preventDefault()
        setStatusMessage('')

        if (!userForm.email) {
            setStatusMessage('User email is required.')
            return
        }

        const payload = {
            email: userForm.email,
            name: userForm.name,
            position: userForm.position,
            avatar_url: userForm.avatar_url,
            bio: userForm.bio,
            ...(userForm.password ? { password: userForm.password } : {}),
        }

        try {
            if (selectedUser) {
                await requestWithLoading(`/admin/users/${selectedUser.id}`, {
                    method: 'PUT',
                    body: payload,
                })
                setStatusMessage('User updated successfully.')
            } else {
                await requestWithLoading('/admin/users', {
                    method: 'POST',
                    body: payload,
                })
                setStatusMessage('User created successfully.')
            }
            await fetchUsers()
            clearUserForm()
        } catch (error) {
            setStatusMessage(error.message)
        }
    }

    const handleConfirmAction = async () => {
        if (!confirmModal.user) {
            setConfirmModal({ open: false, action: '', user: null })
            return
        }

        const user = confirmModal.user
        const action = confirmModal.action
        setConfirmModal({ ...confirmModal, open: false })

        try {
            if (action === 'delete') {
                await requestWithLoading(`/admin/users/${user.id}`, { method: 'DELETE' })
                setStatusMessage(`User ${user.email} soft deleted.`)
            } else if (action === 'restore') {
                await requestWithLoading(`/admin/users/${user.id}/restore`, { method: 'POST' })
                setStatusMessage(`User ${user.email} restored.`)
            }

            await fetchUsers()
            if (selectedUser?.id === user.id) {
                setSelectedUser(null)
                clearUserForm()
            }
        } catch (error) {
            setStatusMessage(error.message)
        }
    }

    const handleBulkDelete = async () => {
        const ids = bulkDeleteIds
            .split(',')
            .map((value) => parseInt(value.trim(), 10))
            .filter(Boolean)

        if (!ids.length) {
            setStatusMessage('Enter at least one numeric user ID for bulk delete.')
            return
        }

        try {
            await requestWithLoading('/admin/users', {
                method: 'DELETE',
                body: { user_ids: ids },
            })
            setStatusMessage(`Bulk soft delete requested for ${ids.length} users.`)
            setBulkDeleteIds('')
            await fetchUsers()
        } catch (error) {
            setStatusMessage(error.message)
        }
    }

    const handleBulkCreate = async () => {
        try {
            const parsed = JSON.parse(bulkCreateJson)
            if (!Array.isArray(parsed)) {
                throw new Error('Bulk create payload must be a JSON array.')
            }
            await requestWithLoading('/admin/users/bulk/create', {
                method: 'POST',
                body: { users: parsed },
            })
            setStatusMessage('Bulk create request sent.')
            await fetchUsers()
        } catch (error) {
            setStatusMessage(error.message)
        }
    }

    const handleBulkUpdate = async () => {
        try {
            const parsed = JSON.parse(bulkUpdateJson)
            if (!Array.isArray(parsed)) {
                throw new Error('Bulk update payload must be a JSON array.')
            }
            await requestWithLoading('/admin/users/bulk/update', {
                method: 'PUT',
                body: { users: parsed },
            })
            setStatusMessage('Bulk update request sent.')
            await fetchUsers()
        } catch (error) {
            setStatusMessage(error.message)
        }
    }

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selected) => selected !== id) : [...prev, id]
        )
    }

    const logout = () => {
        setToken('')
        setUsers([])
        setSelectedUser(null)
        setSelectedIds([])
        setStatusMessage('')
    }

    if (!token) {
        return (
            <div className="space-y-6">
                <div className="space-y-3">
                    <Label>ADMIN LOGIN</Label>
                    <Heading className="text-[1.8rem]">Sign in to manage users</Heading>
                    <Text className="text-sm text-[#5e5d59]">
                        Use admin credentials to authenticate and access the user management API.
                    </Text>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                    <InputField
                        id="username"
                        label="USERNAME"
                        value={authForm.username}
                        onChange={handleAuthChange}
                        placeholder="admin"
                        name="username"
                    />
                    <InputField
                        id="password"
                        label="PASSWORD"
                        type="password"
                        value={authForm.password}
                        onChange={handleAuthChange}
                        placeholder="Enter admin password"
                        name="password"
                    />
                    {authError ? <Text className="text-[#b53333]">{authError}</Text> : null}
                    <Button type="submit">Sign in</Button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 rounded-3xl border border-[#e8e6dc] bg-[#fbf7f2] p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <Label>SESSION</Label>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5e5d59]">
                        <Badge variant="info">Authenticated</Badge>
                        {loading ? <Badge variant="info">Loading…</Badge> : null}
                        <Text className="text-sm">Token length: {token.length}</Text>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" className="w-auto" onClick={fetchUsers}>
                        Refresh users
                    </Button>
                    <Button type="button" className="w-auto bg-[#141413] hover:bg-[#30302e]" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <Card className="space-y-6 bg-[#ffffff] p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <Label>USER DIRECTORY</Label>
                                <Heading className="text-[1.6rem]">Users list</Heading>
                            </div>
                            <Text className="max-w-lg text-sm text-[#5e5d59]">
                                Search users by name or email, select rows for bulk delete, and open a profile for edit or restore.
                            </Text>
                        </div>

                        <form onSubmit={handleFilter} className="grid gap-4 sm:grid-cols-2">
                            <InputField
                                id="searchName"
                                label="Name filter"
                                value={searchName}
                                name="searchName"
                                onChange={(event) => setSearchName(event.target.value)}
                                placeholder="Search name"
                            />
                            <InputField
                                id="searchEmail"
                                label="Email filter"
                                value={searchEmail}
                                name="searchEmail"
                                onChange={(event) => setSearchEmail(event.target.value)}
                                placeholder="Search email"
                            />
                            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                                <Button type="submit" className="w-auto">Apply</Button>
                                <Button type="button" className="w-auto bg-[#141413] hover:bg-[#30302e]" onClick={() => { setSearchName(''); setSearchEmail(''); fetchUsers() }}>
                                    Reset
                                </Button>
                                <Text className="text-sm text-[#5e5d59]">{users.length} users loaded</Text>
                            </div>
                        </form>
                    </div>

                    <DataTable
                        columns={[
                            { key: 'select', label: 'Select' },
                            { key: 'name', label: 'Name' },
                            { key: 'email', label: 'Email' },
                            { key: 'status', label: 'Status' },
                            { key: 'actions', label: 'Actions' },
                        ]}
                        rows={users}
                        selectedIds={selectedIds}
                        onToggleRow={toggleSelect}
                        emptyMessage="No users found."
                        renderRow={({ row, selected, onToggleRow }) => [
                            <td key="select" className="p-3 align-top">
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => onToggleRow(row.id)}
                                    className="h-4 w-4 rounded border-[#d1cfc5] text-[#141413]"
                                />
                            </td>,
                            <td key="name" className="p-3 align-top">
                                <div className="font-medium text-[#141413]">{row.name || '—'}</div>
                                <Text className="text-xs text-[#87867f]">{row.position || 'No position'}</Text>
                            </td>,
                            <td key="email" className="p-3 align-top text-[#4d4c48]">{row.email || '—'}</td>,
                            <td key="status" className="p-3 align-top">
                                {row.is_deleted ? (
                                    <Badge variant="danger">Deleted</Badge>
                                ) : (
                                    <Badge variant="success">Active</Badge>
                                )}
                            </td>,
                            <td key="actions" className="p-3 align-top space-x-2">
                                <Button type="button" className="w-auto bg-[#141413] hover:bg-[#30302e]" onClick={() => selectUser(row)}>
                                    Edit
                                </Button>
                                {row.is_deleted ? (
                                    <Button type="button" className="w-auto bg-[#d9a78e] hover:bg-[#c96442]" onClick={() => setConfirmModal({ open: true, action: 'restore', user: row })}>
                                        Restore
                                    </Button>
                                ) : (
                                    <Button type="button" className="w-auto bg-[#b53333] hover:bg-[#9b2b2b]" onClick={() => setConfirmModal({ open: true, action: 'delete', user: row })}>
                                        Delete
                                    </Button>
                                )}
                            </td>,
                        ]}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-[#5e5d59]">{selectedIds.length} selected for bulk delete.</div>
                        <Button
                            type="button"
                            className="w-auto bg-[#b53333] hover:bg-[#9b2b2b]"
                            onClick={() => {
                                if (!selectedIds.length) {
                                    setStatusMessage('Select at least one user to bulk delete.')
                                    return
                                }
                                setBulkDeleteIds(selectedIds.join(','))
                            }}
                        >
                            Use selected IDs
                        </Button>
                    </div>
                </Card>

                <Card className="space-y-6 bg-[#ffffff] p-6">
                    <div className="space-y-3">
                        <Label>{selectedUser ? 'EDIT USER' : 'NEW USER'}</Label>
                        <Heading className="text-[1.6rem]">{selectedUser ? 'Update user profile' : 'Create new user'}</Heading>
                        <Text className="text-sm text-[#5e5d59]">
                            Build or update a user record with the admin user endpoint.
                        </Text>
                    </div>

                    <form onSubmit={handleUserSave} className="space-y-4">
                        <InputField
                            id="email"
                            label="Email"
                            value={userForm.email}
                            name="email"
                            onChange={handleUserChange}
                            placeholder="user@example.com"
                        />
                        <InputField
                            id="name"
                            label="Name"
                            value={userForm.name}
                            name="name"
                            onChange={handleUserChange}
                            placeholder="John Doe"
                        />
                        <InputField
                            id="position"
                            label="Position"
                            value={userForm.position}
                            name="position"
                            onChange={handleUserChange}
                            placeholder="Senior Developer"
                        />
                        <InputField
                            id="avatar_url"
                            label="Avatar URL"
                            value={userForm.avatar_url}
                            name="avatar_url"
                            onChange={handleUserChange}
                            placeholder="https://example.com/avatar.jpg"
                        />
                        <InputField
                            id="bio"
                            label="Bio"
                            value={userForm.bio}
                            name="bio"
                            onChange={handleUserChange}
                            placeholder="Short profile biography"
                        />
                        <InputField
                            id="password"
                            label="Password"
                            type="password"
                            value={userForm.password}
                            name="password"
                            onChange={handleUserChange}
                            placeholder="Leave blank to keep existing password"
                        />
                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="submit" className="w-auto">{selectedUser ? 'Save changes' : 'Create user'}</Button>
                            <Button type="button" className="w-auto bg-[#141413] hover:bg-[#30302e]" onClick={clearUserForm}>
                                Reset form
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            <Card className="space-y-6 bg-[#ffffff] p-6">
                <div className="space-y-4">
                    <Label>BULK OPERATIONS</Label>
                    <Heading className="text-[1.6rem]">Bulk create, update, delete</Heading>
                    <Text className="text-sm text-[#5e5d59]">
                        Send complex requests through three bulk endpoints. Use raw JSON for bulk create and bulk update, or provide a list of numeric IDs for bulk delete.
                    </Text>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-3 rounded-3xl border border-[#f0eee6] bg-[#faf9f5] p-4">
                        <Label>Bulk delete</Label>
                        <Text className="text-sm text-[#5e5d59]">Comma-separated user IDs for soft delete.</Text>
                        <textarea
                            value={bulkDeleteIds}
                            onChange={(event) => setBulkDeleteIds(event.target.value)}
                            rows="4"
                            className="w-full rounded-2xl border border-[#e8e6dc] bg-white px-4 py-3 text-sm text-[#141413] focus:border-[#3898ec] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
                        />
                        <Button type="button" className="w-full bg-[#b53333] hover:bg-[#9b2b2b]" onClick={handleBulkDelete}>
                            Bulk delete
                        </Button>
                    </div>

                    <div className="space-y-3 rounded-3xl border border-[#f0eee6] bg-[#faf9f5] p-4 lg:col-span-2">
                        <Label>Bulk create</Label>
                        <Text className="text-sm text-[#5e5d59]">Paste an array of user objects and send to bulk create endpoint.</Text>
                        <textarea
                            value={bulkCreateJson}
                            onChange={(event) => setBulkCreateJson(event.target.value)}
                            rows="7"
                            className="w-full rounded-2xl border border-[#e8e6dc] bg-white px-4 py-3 text-sm text-[#141413] focus:border-[#3898ec] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
                        />
                        <Button type="button" className="w-full" onClick={handleBulkCreate}>
                            Bulk create
                        </Button>
                    </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-[#f0eee6] bg-[#faf9f5] p-4">
                    <Label>Bulk update</Label>
                    <Text className="text-sm text-[#5e5d59]">Provide an array of update objects for the bulk update endpoint.</Text>
                    <textarea
                        value={bulkUpdateJson}
                        onChange={(event) => setBulkUpdateJson(event.target.value)}
                        rows="7"
                        className="w-full rounded-2xl border border-[#e8e6dc] bg-white px-4 py-3 text-sm text-[#141413] focus:border-[#3898ec] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20"
                    />
                    <Button type="button" className="w-full bg-[#141413] hover:bg-[#30302e]" onClick={handleBulkUpdate}>
                        Bulk update
                    </Button>
                </div>
            </Card>

            {statusMessage ? (
                <div className="rounded-3xl border border-[#e8e6dc] bg-[#fbf7f2] p-4 text-sm text-[#4d4c48]">
                    {statusMessage}
                </div>
            ) : null}

            <Modal
                open={confirmModal.open}
                title={
                    confirmModal.action === 'delete'
                        ? 'Confirm delete'
                        : confirmModal.action === 'restore'
                        ? 'Confirm restore'
                        : 'Confirm action'
                }
                onClose={() => setConfirmModal({ open: false, action: '', user: null })}
                actions={
                    <>
                        <Button type="button" className="w-auto" onClick={handleConfirmAction}>
                            Confirm
                        </Button>
                        <Button
                            type="button"
                            className="w-auto bg-[#141413] hover:bg-[#30302e]"
                            onClick={() => setConfirmModal({ open: false, action: '', user: null })}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <Text>
                    {confirmModal.action === 'delete'
                        ? `Delete user ${confirmModal.user?.email || ''}? This action performs a soft delete.`
                        : `Restore user ${confirmModal.user?.email || ''}?`}
                </Text>
            </Modal>
        </div>
    )
}
