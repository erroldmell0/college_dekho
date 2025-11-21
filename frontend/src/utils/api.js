import axios from 'axios'

export const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const client = axios.create({ baseURL: API })

export async function request(path, options = {}) {
    const token = localStorage.getItem('token')
    const headers = { ...(options.headers || {}) }
    if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`

    try {
        const res = await client.request({
            url: path,
            method: options.method || 'GET',
            headers,
            data: options.body,
            params: options.params,
            responseType: options.responseType,
        })

        return res.data
    } catch (err) {
        // normalize axios error into previous shape
        let message = 'Request failed'
        let data = null
        if (err.response) {
            data = err.response.data
            if (typeof data === 'string') message = data
            else if (data && data.message) message = data.message
            else if (Array.isArray(data && data.errors)) message = data.errors.map(e => e.msg || e.message).join(', ')
            else if (data) message = JSON.stringify(data)
            const error = new Error(message)
            error.status = err.response.status
            error.data = data
            throw error
        }

        // network or other error
        throw new Error(err.message || message)
    }
}

