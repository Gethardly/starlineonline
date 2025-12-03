import {z} from "zod";

export interface User {
    userId?: number;
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Me {
    success: boolean,
    user: null | User
}

export interface Pos {
    dir?: number;
    s?: number;
    sat_qty?: number;
    direction?: string;
    ts: number;
    x: string;
    y: string;
    speed: number;
}

export interface Device {
    id?: number;
    alias: string;
    deviceId: string;
    pos: Pos;
    status: number;
    createdAt?: string;
    updatedAt?: string;
    imei?: string;
}

export interface Position {
    id: number,
    x: number,
    y: number,
    name: string,
    address: string,
    contacts: string,
    description: string,
    note: string,
    positionId: number,
    positionNumber: number,
    createdAt: string,
    updatedAt: string
}

export const userFormSchema = z.object({
    name: z.string(),
    email: z.string(),
    role: z.string(),
    password: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const positionFormSchema = z.object({
    positionId: z.string().optional(),
    device_id: z.string(),
    name: z.string().min(4, "Введите название места"),
    address: z.string().min(6, "Адрес обязателен"),
    contacts: z.string()
        .min(13, "Введите полный номер")
        .transform((val) => {
            return "+996" + val.replace(/[^\d]/g, "").slice(3);
        })
        .refine((val) => /^\+996\d{9}$/.test(val), {
            message: "Неверный номер телефона",
        }),
    description: z.string().min(5, "Введите описание"),
    note: z.string().optional(),
    x: z.string(),
    y: z.string(),
    positionNumber: z.number({error: "Введите номер позиции"})
        .min(1, {message: "Минимальное значение — 1"}),
});

export const deviceFormSchema = z.object({
    device_id: z.string(),
    alias: z.string()
});