import {type Request} from 'express';

export interface User {
    userId: number;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User
}

export enum Role {
    admin = 'admin',
    user = 'user',
}