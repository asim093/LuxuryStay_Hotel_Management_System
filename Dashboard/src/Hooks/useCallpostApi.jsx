import React, { useState } from 'react'

const useCallpostApi = ({ url, method, body }) => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const baseUrl = "http://localhost:3001";

    const ApiCall = async () => {
        setLoading(true);
        setError(null); 
        
        try {
            const response = await fetch(baseUrl + url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
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