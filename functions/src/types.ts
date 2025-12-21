import { DocumentData } from "firebase-admin/firestore"
import { HttpStatusCodeEnum } from "./enums"

export type AuthResultType = {
    status: typeof HttpStatusCodeEnum[keyof typeof HttpStatusCodeEnum],
    success: boolean,
    message: string,
    data: DocumentData
}