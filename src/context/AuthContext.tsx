import { useState, type ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import type { LoginFormInterface, RegisterFormInterface } from '@/interfaces';
import type { AuthResultType } from '@/types';
import { loginAccount, registerAccount } from '@/services/auth';
import { Outlet, type NavigateFunction } from 'react-router-dom';
import { useOnAuthStateChanged } from '@/hooks/use-on-auth';
import { useAppDispatch } from '@/states/hooks';
import { setCurrentUser, setErrorMsg, setLoading } from '@/states/slice/app-slice';
import { AuthContext } from '.';
import type { UserImplInterface } from '@/interfaces/firebaseAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch()
    const [authLoading, setAuthLoading] = useState<boolean>(true);


    useOnAuthStateChanged({ setCurrentUser: (user?: UserImplInterface) => dispatch(setCurrentUser(user)), setAuthLoading })

    const handleLogin = async (loginField: LoginFormInterface, navigate: NavigateFunction) => {
        dispatch(setLoading(true))
        await loginAccount(loginField, (user) => dispatch(setCurrentUser(user)))
            .then((result: AuthResultType) => {
                if (result.success) navigate('/dashboard');
                if (result.message) dispatch(setErrorMsg(result.message));
            })
            .finally(() => dispatch(setLoading(false)))
    }

    const handleLogout = (navigate: NavigateFunction) => {
        dispatch(setErrorMsg(''))
        dispatch(setLoading(true))
        signOut(auth)
            .then(() => {
                navigate("/");
            })
            .catch((error) => dispatch(setErrorMsg(error.message)))
            .finally(() => dispatch(setLoading(false)))
    }

    const handleRegister = async (data: RegisterFormInterface, navigate: NavigateFunction) => {
        dispatch(setErrorMsg(''))
        dispatch(setLoading(true))
        await registerAccount(data)
            .then((result: AuthResultType) => {
                if (result.success) navigate('/login');
                if (result.message) dispatch(setErrorMsg(result.message));
            })
            .finally(() => dispatch(setLoading(false)))
    };

    const context = { handleRegister, handleLogin, handleLogout };

    return (
        <AuthContext.Provider value={context}>
            {!authLoading ? children : <Outlet />}
        </AuthContext.Provider>
    );
};

