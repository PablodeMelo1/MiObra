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
        setIsLoading(true);
        const response = await loginRequest(user);

        try {
            const sessionResponse = await verifySessionRequest();
            setUser(sessionResponse.data?.user ?? sessionResponse.data);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }

        return response;
    };

    const signOut = async () => {
        await logoutRequest();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{signUp, signIn, signOut, user, isAuthenticated, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
}
