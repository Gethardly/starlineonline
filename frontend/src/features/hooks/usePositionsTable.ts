import {useState} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {isAxiosError} from "axios";
import axiosApi from "@/axios.ts";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {useNewPositionForm} from "./useNewPositionForm";
import type {Position} from "@/features/types.ts";

const excelHeadersMap: Record<keyof Position, string> = {
    id: "ID",
    x: "X",
    y: "Y",
    name: "Название",
    address: "Адрес",
    contacts: "Контакты",
    description: "Описание",
    note: "Примечание",
    positionId: "ID позиции",
    positionNumber: "Номер позиции",
    createdAt: "Дата создания",
    updatedAt: "Дата обновления"
};

export const usePositionsTable = () => {
    const {toast} = useToast();
    const {positions ,getPositions, currentPage, pageSize, setPageSize, handleNext, handlePrev, totalPages, search, setSearch} = useNewPositionForm(false);
    const [isPositionDeleteSelected, setIsPositionDeleteSelected] = useState<number | boolean>(false);

    const handleDelete = async () => {
        try {
            await axiosApi.delete("positions/" + isPositionDeleteSelected);
            toast({
                title: "Позиция удалена",
                description: isPositionDeleteSelected,
                duration: 5000,
            });
            await getPositions();
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

    const exportToExcel = () => {
        const transformedData = positions.map(pos =>
            Object.fromEntries(
                Object.entries(pos).map(([key, value]) => [
                    excelHeadersMap[key as keyof Position] || key,
                    value
                ])
            )
        );

        const ws = XLSX.utils.json_to_sheet(transformedData);

        const keys = Object.keys(transformedData[0]);
        ws['!cols'] = keys.map(key => {
            if (key === excelHeadersMap.address) {
                return { wch: 30 };
            } else {
                const maxLength = Math.max(
                    key.length,
                    ...transformedData.map(row => {
                        const cellValue = row[key];
                        return cellValue ? cellValue.toString().length : 0;
                    })
                );
                return { wch: maxLength + 2 };
            }
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Список позиций");

        const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array"
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(blob, "Список позиций.xlsx");
    }
    return {
        isPositionDeleteSelected,
        setIsPositionDeleteSelected,
        handleDelete,
        positions,
        exportToExcel,
        pageSize,
        setPageSize,
        handleNext,
        handlePrev,
        currentPage,
        totalPages,
        search,
        setSearch
    }
}