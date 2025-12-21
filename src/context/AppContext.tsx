import { lazy, Suspense, useCallback, useState, type ReactNode } from 'react';
import { AppContext } from '.';

type Breadcrumb = { [key: string]: string }

const LayoutComponents = lazy(() => import('@/layouts/layout'))

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    const delayTimer = useCallback((callback: () => void, delayTime: number = 1000) => {
        setTimeout(() => {
            callback()
        }, delayTime);
    }, [])

    const context = { breadcrumbs, setBreadcrumbs, delayTimer };

    return (
        <AppContext.Provider value={context}>
            <Suspense fallback={<div className='text-center min-h-dvh w-full mx-auto bg-primary/10 text-base-content flex items-center justify-center'>
                <p>ForgeMockAPI</p>
            </div>}>
                <LayoutComponents>
                    {children}
                </LayoutComponents>
            </Suspense>
        </AppContext.Provider>
    );
};
