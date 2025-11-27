import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import type { LoginFormInterface, RegisterFormInterface } from "../interfaces";
import { auth } from "@/firebase";
import { saveUserProfile } from "./user-service";
import type { AuthResultType } from "@/types";
import type { UserImplInterface } from "@/interfaces/firebaseAuth";

export const registerAccount = async (data: RegisterFormInterface): Promise<AuthResultType> => {
    const { email, password, name } = data

    let result: AuthResultType = { success: true, message: '', data: {} }

    try {
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (credential) => await saveUserProfile(credential.user.uid, { email, name }))

        result.data = { email, name }

    } catch (err: any) {

        let errMessage = err.customData._tokenResponse.error.message

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

    return result
};
export const loginAccount = async ({ email, password }: LoginFormInterface, setCurrentUser: (e: UserImplInterface | null) => void): Promise<AuthResultType> => {

    let result: AuthResultType = { success: true, message: '', data: {} }

    try {
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (credential) => {
                // Signed in
                const user: any = credential.user;
                user.localId = credential.user.uid;
                setCurrentUser(user);
            })

    } catch (err: any) {

        let errMessage = err.code

        switch (err.code) {
            case 'auth/invalid-credential':
                errMessage = 'Incorrect Username or Password'
                break;

            default:
                break;
        }

        result.success = false
        result.message = errMessage
    }

    return result
};