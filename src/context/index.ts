import { createContext, useContext } from 'react';
import type { AuthContextInterface } from '@/interfaces';

type Breadcrumb = { [key: string]: string }

interface AppContextInterface {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
    delayTimer: (d: () => void, delayTime?: number) => void
}


export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);
export const AppContext = createContext<AppContextInterface | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

