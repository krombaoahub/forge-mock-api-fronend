import { db } from "@/firebase";
import type { SaveUserProfileInterface } from "@/interfaces";
import { timestamp } from "@/libs/utils";
import { doc, setDoc } from "firebase/firestore";

// move to api
export async function saveUserProfile(uid: string, userData: SaveUserProfileInterface) {
    const userRef = doc(db, "users", uid);
    
    return await setDoc(userRef, {
        displayName: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber || null,
        photoURL: userData.photoURL || null,
        ...timestamp
    }, { merge: true });
}
