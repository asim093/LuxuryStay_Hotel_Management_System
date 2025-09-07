import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const useCallpostApi = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseUrl = "http://localhost:3001";
    const token = useSelector((state) => state.user.token);

    const ApiCall = async ({ url, method, body }) => {
        setLoading(true);
        setError(null); 
        
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(baseUrl + url, {
                method: method,
                headers: headers,
                body: body ? JSON.stringify(body) : undefined
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            setResponse(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return { response, loading, error, ApiCall };
}

export default useCallpostApi