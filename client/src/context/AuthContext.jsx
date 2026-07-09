import { useEffect, useState } from 'react';
import {
    confirmEmailVerificationRequest,
    acceptEmployeeInvitationRequest,
    loginRequest,
    registerRequest,
    resendEmailVerificationRequest,
    logoutRequest,
    switchActiveCompanyRequest,
    verifySessionRequest,
} from '../api/auth';
import { AuthContext } from './auth-context';

const resolveUser = (payload) => payload?.user ?? payload;
const resolveCompanies = (payload) => payload?.companies ?? [];

const persistActiveCompanyId = (activeCompanyId) => {
    if (activeCompanyId) {
        window.localStorage.setItem('activeCompanyId', activeCompanyId);
    } else {
        window.localStorage.removeItem('activeCompanyId');
    }
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [activeCompany, setActiveCompany] = useState(null);
    const [companyRole, setCompanyRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const applyAuthPayload = (payload) => {
        const nextUser = resolveUser(payload);
        const nextCompanies = resolveCompanies(payload);
        setUser(nextUser);
        setCompanies(nextCompanies);
        setActiveCompany(payload?.activeCompany ?? null);
        setCompanyRole(payload?.companyRole ?? null);
        persistActiveCompanyId(payload?.activeCompanyId ?? payload?.activeCompany?._id ?? null);
        setIsAuthenticated(Boolean(nextUser));
    };

    const clearAuthPayload = () => {
        setUser(null);
        setCompanies([]);
        setActiveCompany(null);
        setCompanyRole(null);
        persistActiveCompanyId(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            setIsLoading(true);
            try {
                const response = await verifySessionRequest();
                if (!isMounted) return;
                applyAuthPayload(response.data);
            } catch {
                if (!isMounted) return;
                clearAuthPayload();
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
        return response;
    };

    const confirmEmailVerification = async (token) => confirmEmailVerificationRequest(token);

    const resendEmailVerification = async (email) => resendEmailVerificationRequest(email);

    const acceptEmployeeInvitation = async (token) => acceptEmployeeInvitationRequest(token);

    const signIn = async (user) => {
        try {
            const response = await loginRequest(user);
            applyAuthPayload(response.data);
            return response;
        } catch (error) {
            clearAuthPayload();
            throw error;
        }
    };

    const switchCompany = async (companyId) => {
        const response = await switchActiveCompanyRequest(companyId);
        applyAuthPayload(response.data);
        return response;
    };

    const signOut = async () => {
        try {
            await logoutRequest();
        } finally {
            clearAuthPayload();
        }
    };

    return (
        <AuthContext.Provider value={{
            signUp,
            signIn,
            signOut,
            switchCompany,
            confirmEmailVerification,
            resendEmailVerification,
            acceptEmployeeInvitation,
            user,
            companies,
            activeCompany,
            companyRole,
            isAuthenticated,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
