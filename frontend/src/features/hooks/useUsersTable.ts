import {useEffect, useState} from "react";
import axiosApi from "@/axios.ts";
import {type User, type UserFormData, userFormSchema} from "@/features/types.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {isAxiosError} from "axios";

export const roles = ['admin', 'user'];

export const useUsersTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [existingUser, setExistingUser] = useState<User | null>(null);
    const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isUserDeleteSelected, setIsUserDeleteSelected] = useState<number | boolean>(false);

    const getUsers = async () => {
        try {
            const {data} = await axiosApi.get<User[]>("/users");

            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        (async () => {
            await getUsers();
        })();
    }, []);

    const {toast} = useToast();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        values: {
            name: existingUser?.name ?? "",
            email: existingUser?.email ?? "",
            role: existingUser?.role ?? roles[1],
            password: ""
        }
    });

    const createOrUpdateUser = async (userFormData: UserFormData) => {
        try {
            existingUser
                ? await axiosApi.patch('/users/' + existingUser.id, userFormData)
                : await axiosApi.post('/users', userFormData);
            toast({
                title: "Пользователь " + existingUser ? "отредактирован" : "добавлен",
                description: userFormData.name,
                duration: 500,
            });
            await getUsers();
            form.reset();
            setExistingUser(null);
            setCreateUserModalOpen(false);
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 401) {
                    toast({variant: "destructive", title: "Не авторизован"});
                } else if (e.response?.status === 422) {
                    toast({variant: "destructive", title: "Ошибка валидации"});
                } else {
                    toast({variant: "destructive", title: "Ошибка сервера при отправке"});
                }
            }
        }
    }

    const deleteUser = async () => {
        try {
            await axiosApi.delete('/users/' + isUserDeleteSelected);
            await getUsers();
            toast({
                title: "Пользователь удален",
                duration: 500,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.response?.status === 401) {
                    toast({variant: "destructive", title: "Не авторизован"});
                } else if (e.response?.status === 422) {
                    toast({variant: "destructive", title: "Ошибка валидации"});
                } else {
                    toast({variant: "destructive", title: "Ошибка сервера при отправке"});
                }
            }
        }
    }

    return {
        form,
        users,
        createUserModalOpen,
        existingUser,
        setCreateUserModalOpen,
        setExistingUser,
        isUserDeleteSelected,
        createOrUpdateUser: form.handleSubmit(createOrUpdateUser),
        setIsUserDeleteSelected,
        deleteUser
    };
}