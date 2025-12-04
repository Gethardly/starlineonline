import {useNewPositionForm} from "@/features/hooks/useNewPositionForm.ts";
import {z} from "zod";
import {type Device, deviceFormSchema} from "@/features/types";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import axiosApi from "@/axios.ts";
import {isAxiosError} from "axios";
import {useToast} from "@/hooks/use-toast.ts";

type DeviceFormData = z.infer<typeof deviceFormSchema>;

export const useNewDeviceForm = () => {
    const {toast} = useToast();
    const {devices} = useNewPositionForm(true);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(false);

    const onSelectChange = (val: string) => {
        const device = devices.find((d) => d.deviceId === val);
        if (device) {
            setSelectedDevice(device);
            form.setValue("device_id", val);
            form.setValue("alias", device.alias,);
        }
    };

    const form = useForm<DeviceFormData>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: {
            device_id: "",
            alias: ""
        }
    });

    const onSubmit = async (values: DeviceFormData) => {
        setLoading(true);
        try {
            await axiosApi.post("/devices", {
                ...values,
                deviceId: values.device_id.toString(),
            });

            toast({
                title: "Устройство добавлено",
                description: values.alias,
                duration: 3000,
            });

            form.setValue("device_id", "");
            form.setValue("alias", "");
            setSelectedDevice(null);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast({variant: "destructive", title: "Не авторизован"});
                } else if (error.response?.status === 409) {
                    toast({variant: "destructive", title: error.response?.data.message});
                    console.log(error);
                } else if (error.response?.status === 422) {
                    toast({variant: "destructive", title: "Ошибка валидации"});
                } else {
                    toast({variant: "destructive", title: "Ошибка сервера при отправке"});
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return {
        devices,
        form,
        loading,
        selectedDevice,
        onSubmit: form.handleSubmit(onSubmit),
        onSelectChange,
    }
}