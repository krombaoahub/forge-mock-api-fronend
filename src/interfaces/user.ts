import type { User } from "firebase/auth";

export interface UserImpl extends User {
    accessToken: string;
    auth: Auth;
    displayName: null;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    localId: string;
    metadata: Metadata;
    phoneNumber: null;
    photoURL: null;
    proactiveRefresh: ProactiveRefresh;
    providerData: ProviderDatum[];
    providerId: string;
    reloadListener: null;
    reloadUserInfo: ReloadUserInfo;
    stsTokenManager: StsTokenManager;
    tenantId: null;
    uid: string;
}

export interface Auth {
    name:string
}

export interface Metadata {
    createdAt: string;
    lastLoginAt: string;
    lastSignInTime: string;
    creationTime: string;
}

export interface ProactiveRefresh {
    isRunning: boolean;
    timerId: number;
    errorBackoff: number;
}

export interface ProviderDatum {
    displayName: null;
    email: string;
    phoneNumber: null;
    photoURL: null;
    providerId: string;
    uid: string;
}

export interface ReloadUserInfo {
    createdAt: string;
    email: string;
    emailVerified: boolean;
    lastLoginAt: string;
    lastRefreshAt: Date;
    localId: string;
    passwordHash: string;
    passwordUpdatedAt: number;
    providerUserInfo: ProviderUserInfo[];
}

export interface ProviderUserInfo {
    email: string;
    federatedId: string;
    providerId: string;
    rawId: string;
}

export interface StsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
}
