import {z} from "zod";

export interface Me {
    success: boolean,
    user: null | {
        userId: number,
        email: string
    }
}

export interface Pos {
    dir?: number;
    s?: number;
    sat_qty?: number;
    ts: number;
    x: number;
    y: number;
}

export interface Device {
    alias: string;
    device_id: number;
    pos: Pos;
    status: number;
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
    x: z.number(),
    y: z.number(),
    positionNumber: z.number().min(1, "Введите номер позиции")
});

export const deviceFormSchema = z.object({
    device_id: z.string(),
    alias: z.string()
});