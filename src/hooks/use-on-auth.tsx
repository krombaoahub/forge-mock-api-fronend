import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserImplInterface } from '@/interfaces/firebaseAuth';

interface UseOnAuthStateChangedInterface {
    setCurrentUser: (e: UserImplInterface | null) => void
    setAuthLoading: (e: boolean) => void
}

export function useOnAuthStateChanged({ setCurrentUser, setAuthLoading }: UseOnAuthStateChangedInterface) {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: any) => {

            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {

                    const userDataFromFirestore = userDocSnap.data();
                    
                    userDataFromFirestore.createdAt = userDataFromFirestore.createdAt?.toMillis() || null;
                    userDataFromFirestore.uid = userDataFromFirestore.ui?.toMillis() || null;

                    const fullUserProfile = {
                        ...user.reloadUserInfo,
                        ...userDataFromFirestore,
                    };
                    setCurrentUser(fullUserProfile);
                } else {
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setAuthLoading(false);
        });
        return unsubscribe;
    }, []);
}