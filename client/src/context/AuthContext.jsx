import { useEffect, useState } from 'react';
import { registerRequest, loginRequest, verifySessionRequest, logoutRequest } from '../api/auth';
import { AuthContext } from './auth-context';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            setIsLoading(true);
            try {
                const response = await verifySessionRequest();
                if (!isMounted) return;
                setUser(response.data?.user ?? response.data);
                setIsAuthenticated(true);
            } catch {
                if (!isMounted) return;
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, []);
    
    const signUp = async (user) => {
        const response = await registerRequest(user);
        setUser(response.data?.user ?? response.data);
        setIsAuthenticated(true);
        return response;
    };

    const signIn = async (user) => {
        try {
            const response = await loginRequest(user);
            setUser(response.data?.user ?? response.data);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{signUp, signIn, signOut, user, isAuthenticated, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}
