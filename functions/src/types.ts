import { HttpStatusCode } from "./enums"

export type AuthResultType = {
    status: typeof HttpStatusCode[keyof typeof HttpStatusCode],
    success: boolean,
    message: string,
    data: any
}