import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import axiosApi from "@/axios.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {isAxiosError} from "axios";
import {type Device, positionFormSchema} from "@/features/types";

type PositionFormData = z.infer<typeof positionFormSchema>;

export const useNewPositionForm = () => {
    const {toast} = useToast();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [posInfo, setPosInfo] = useState<string>("");
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

    const form = useForm<PositionFormData>({
        resolver: zodResolver(positionFormSchema),
        defaultValues: {
            device_id: 0,
            name: "",
            address: "",
            contacts: "",
            description: "",
            note: "",
            x: 0,
            y: 0,
        },
    });

    const loading = loadingDevices || loadingAddress || form.formState.isSubmitting;

    useEffect(() => {
        (async () => {
            setLoadingDevices(true);
            try {
                const {data} = await axiosApi.get("/starline/devices");
                const fetchedDevices: Device[] = data.data.devices || [];

                setDevices(fetchedDevices);

                if (fetchedDevices.length > 0) {
                    const firstDevice = fetchedDevices[0];
                    setSelectedDevice(firstDevice);

                    form.setValue("device_id", firstDevice.device_id)
                    form.setValue("x", firstDevice.pos.x);
                    form.setValue("y", firstDevice.pos.y);
                }
            } catch (e) {
                console.error("Failed to load devices:", e);
            } finally {
                setLoadingDevices(false);
            }
        })();
    }, []);

    useEffect(() => {
        setPosInfo("");
        setLoadingAddress(true);

        if (!selectedDevice?.device_id || devices.length === 0) {
            setLoadingAddress(false);
            return;
        }

        if (!selectedDevice?.pos?.x || !selectedDevice?.pos?.y) {
            setPosInfo("Координаты недоступны");
            form.setValue("address", "Координаты недоступны");
            setLoadingAddress(false);
            return;
        }

        const lat = selectedDevice.pos.x;
        const lon = selectedDevice.pos.y;

        (async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1&accept-language=ru`,
                    {
                        headers: {
                            "User-Agent": "MyFleetApp/1.0 (+your@email.com)",
                        },
                    }
                );

                if (!response.ok) throw new Error("Nominatim error");

                const data = await response.json();
                const address = `${data.display_name} ${data?.address?.house_number || ""}`;

                setPosInfo(address || "Неизвестно");
                form.setValue("address", address);
            } catch (e) {
                console.error("Reverse geocoding failed:", e);
                const errorMsg = "Адрес не найден";
                setPosInfo(errorMsg);
                form.setValue("address", errorMsg);
            } finally {
                setLoadingAddress(false);
            }
        })();
    }, [selectedDevice, devices, form]);

    const onSelectChange = (val: string) => {
        const device = devices.find((d) => d.device_id === parseInt(val));
        if (device) {
            setSelectedDevice(device);
            form.setValue("device_id", parseInt(val));
            form.setValue("x", device.pos.x,);
            form.setValue("y", device.pos.y,);
        }
    };

    const onSubmit = async (positionFormData: PositionFormData) => {
        try {
            const {data} = await axiosApi.get("/starline/devices");
            const fetchedDevices: Device[] = data.data.devices || [];
            const fetchedDevice = fetchedDevices.find((d) => d.device_id === positionFormData.device_id);

            const payload = {
                ...positionFormData,
                x: fetchedDevice?.pos.x,
                y: fetchedDevice?.pos.y,
            }

            await axiosApi.post('/positions', payload);

            toast({
                title: "Позиция добавлена",
                description: positionFormData.name,
                duration: 5000,
            });

            form.reset();
            setSelectedDevice(null);

        } catch (error) {
            if (isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast({variant: "destructive", title: "Не авторизован"});
                } else if (error.response?.status === 422) {
                    toast({variant: "destructive", title: "Ошибка валидации"});
                } else {
                    toast({variant: "destructive", title: "Ошибка сервера при отправке"});
                }
            }
        }
    };

    return {
        loading,
        devices,
        loadingDevices,
        loadingAddress,
        posInfo: loadingAddress ? "Определяем адрес..." : posInfo,
        selectedDevice,
        onSelectChange,
        form,
        onSubmit: form.handleSubmit(onSubmit),
    };
};