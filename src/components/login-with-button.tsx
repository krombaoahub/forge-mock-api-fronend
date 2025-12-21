import { DEVELOPMENT } from "@/contants";
import { auth } from "@/firebase";
import { cn, env } from "@/libs/utils";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type React from "react";

export const LoginWithGoogle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Logged in user:", user);
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                console.error("Google login error:", err.code, err.message);
            }
        }
    };

    return (
        env.MODE !== DEVELOPMENT && <>
            <div className={cn("flex justify-center w-full", className)} {...props}>
                <button onClick={handleGoogleLogin} type="submit" className='w-full btn btn-primary'>Login with Google</button>
            </div>
        </>
    )

}