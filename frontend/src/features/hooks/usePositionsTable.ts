import {useState} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {isAxiosError} from "axios";
import axiosApi from "@/axios.ts";

export const usePositionsTable = () => {
    const {toast} = useToast();
    const [isPositionDeleteSelected, setIsPositionDeleteSelected] = useState<number | boolean>(false);

    const handleDelete = async () => {
        try {
            await axiosApi.delete("positions/" + isPositionDeleteSelected);
            toast({
                title: "Позиция удалена",
                description: isPositionDeleteSelected,
                duration: 5000,
            });
            setIsPositionDeleteSelected(false);
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
        isPositionDeleteSelected,
        setIsPositionDeleteSelected,
        handleDelete,
    }
}