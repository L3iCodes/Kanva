import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on start
    useEffect(() => {
        if(token){
            validateToken();
        } else{
            setLoading(false)
        }
    }, [])

    const validateToken = async () => {
        try{
            const response = await fetch(`${BACKEND_URL}/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.ok){
                const data = await response.json();
                setUser(data.user)
            }else{
                // Logout if token is invalid
                logout();
            }
        }catch(error){
            console.error('Token validation error:', error);
            logout();
        }finally{
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        try{
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(credentials),
            })

            const data = await response.json();

            if(response.ok) {
                localStorage.setItem('token', data.token)
                setToken(data.token);
                setUser(data.user);
                return { success: true, message: data.message }
            }else{
                return { success: false, message: data.message }
            }
        }catch(error){
            console.error('Login error '+ error);
            return { success: false, message: data.message }
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token')
    }

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    // Function to make authenticated API calls
    const authenticatedFetch = async (url, options = {}) => {
        const config = {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            // Token expired or invalid
            logout();
            window.location.href = '/login';
        }

        return response;
    };

    const value = {
        user, token, loading, login, logout, isAuthenticated, authenticatedFetch
    }


    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}