import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const useCallgetApi = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = useSelector((state) => state.user.token);

    const Apicall = async (url, method = 'GET', body = null) => {
        setLoading(true);
        setError(null);

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                toast.error('Please login again');
                setLoading(false);
                return null;
            }

            const config = {
                method: method,
                headers: headers,
            };

            if (body && method !== 'GET') {
                config.body = JSON.stringify(body);
            }

            const response = await fetch(baseUrl + url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setResponse(data);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error(err.message);
            return null;
        }
    }

    return { response, loading, error, Apicall }
}

export default useCallgetApi;