import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import type { LoginFormInterface, RegisterFormInterface } from "../interfaces";
import { auth } from "@/firebase";
import { saveUserProfile } from "./user-service";
import type { AuthResultType } from "@/types";
import type { UserImplInterface } from "@/interfaces/firebaseAuth";
import { FirebaseError } from "@firebase/util";

export const registerAccount = async (data: RegisterFormInterface): Promise<AuthResultType> => {
    const { email, password, name } = data

    const result: AuthResultType = { success: true, message: '', data: {} }

    try {
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (credential) => await saveUserProfile(credential.user.uid, { email, name }))

        result.data = { email, name }

    } catch (err: unknown) {
        if (err instanceof FirebaseError) {
            let errMessage = 'An unexpected error occurred';
            switch (err.code) {
                case 'auth/email-already-in-use':
                    errMessage = 'Email is already exists.'
                    break;

                default:
                    break;
            }
            result.success = false
            result.message = errMessage
        }
    }

    return result
};
export const loginAccount = async ({ email, password }: LoginFormInterface, setCurrentUser: (e: UserImplInterface) => void): Promise<AuthResultType> => {

    const result: AuthResultType = { success: true, message: '', data: {} }

    try {
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (credential) => {
                const user: UserImplInterface = credential.user;
                user.localId = credential.user.uid;
                setCurrentUser(user);
            })

    } catch (err: unknown) {
        if (err instanceof FirebaseError) {
            let errMessage = 'An unexpected error occurred';
            switch (err.code) {
                case 'auth/invalid-credential':
                    errMessage = 'Incorrect Username or Password';
                    break;
                default:
                    errMessage = err.message;
                    break;
            }
            result.success = false;
            result.message = errMessage;
        }
    }

    return result
};