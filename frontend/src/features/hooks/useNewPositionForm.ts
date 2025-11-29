import {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import axiosApi from "@/axios.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {isAxiosError} from "axios";
import {type Device, type Position, positionFormSchema} from "@/features/types";

type PositionFormData = z.infer<typeof positionFormSchema>;

export const useNewPositionForm = (isForm: boolean) => {
    const {toast} = useToast();
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const [loadingAddress, setLoadingAddress] = useState(true);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(devices[0]);
    const [editEnabled, setEditEnabled] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);
    const [positionsLoading, setPositionsLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const textLoading = "Загрузка данных..."

    const form = useForm<PositionFormData>({
        resolver: zodResolver(positionFormSchema),
        values: {
            positionId: selectedPosition?.id.toString() ?? "",
            device_id: selectedDevice?.device_id.toString() ?? "",
            name: editEnabled ? selectedPosition?.name ?? "" : "",
            address: selectedPosition?.address ?? textLoading,
            contacts: editEnabled ? selectedPosition?.contacts ?? "" : "",
            description: editEnabled ? selectedPosition?.description ?? "" : "",
            note: editEnabled ? selectedPosition?.note ?? "" : "",
            x: editEnabled ? selectedPosition?.x ?? 0 : selectedDevice?.pos.x ?? 0,
            y: editEnabled ? selectedPosition?.y ?? 0 : selectedDevice?.pos.y ?? 0,
            positionNumber: selectedPosition?.positionNumber ?? 0
        }
    });

    const loading = loadingDevices || loadingAddress || form.formState.isSubmitting || positionsLoading;

    const getPositions = async () => {
        try {
            setPositionsLoading(true);
            const {data: positions} = await axiosApi.get<Position[]>("/positions");

            setPositions(positions);
            setSelectedPosition(positions[0]);

            window.parent.postMessage({
                action: "SET_POINTS",
                positions,
            }, "https://starline-online.ru");
        } catch (e) {
            console.error(e);
        } finally {
            setPositionsLoading(false);
        }
    }

    const getAddress = useCallback(async () => {
        try {
            if (!selectedDevice?.device_id || devices.length === 0) {
                setLoadingAddress(false);
                return;
            }

            if (!selectedDevice?.pos?.x || !selectedDevice?.pos?.y) {
                form.setValue("address", "Координаты недоступны");
                setLoadingAddress(false);
                return;
            }

            const locationiq_api_key = "pk.1e107374b751a1efeeb010dad2253d40";
            const lat = selectedDevice.pos.x;
            const lon = selectedDevice.pos.y;

            let data;

            try {
                const nominatimRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1&accept-language=ru`,
                    {
                        headers: {
                            "User-Agent": "MyFleetApp/1.0 (+your@email.com)",
                        },
                    }
                );

                if (!nominatimRes.ok) throw new Error("Nominatim failed");

                data = await nominatimRes.json();
            } catch (err) {
                console.warn("⚠ Nominatim failed, switching to LocationIQ");

                const locRes = await fetch(
                    `https://us1.locationiq.com/v1/reverse?key=${locationiq_api_key}&lat=${lat}&lon=${lon}&format=json&accept-language=ru`
                );

                if (!locRes.ok) throw new Error("LocationIQ error");

                data = await locRes.json();
            }

            const address = `${data.display_name} ${data?.address?.house_number || ""}`;

            form.setValue("address", address);
        } catch (e) {
            console.error("Reverse geocoding failed:", e);
            const errorMsg = "Адрес не найден";
            form.setValue("address", errorMsg);
        } finally {
            setLoadingAddress(false);
        }
    }, [devices.length, form, selectedDevice?.device_id, selectedDevice?.pos.x, selectedDevice?.pos.y]);

    useEffect(() => {
        if (!editEnabled) {
            (async () => {
                setLoadingDevices(true);
                try {
                    if (isForm) {
                        const {data} = await axiosApi.get("/starline/devices");
                        const fetchedDevices: Device[] = data.data.devices || [];

                        await getPositions();
                        setDevices(fetchedDevices);

                        if (fetchedDevices.length > 0) {
                            const firstDevice = fetchedDevices[0];
                            setSelectedDevice(firstDevice);

                            form.setValue("device_id", firstDevice.device_id.toString())
                            form.setValue("x", firstDevice.pos.x);
                            form.setValue("y", firstDevice.pos.y);
                        }
                    } else {
                        await getPositions();
                    }

                } catch (e) {
                    console.error("Failed to load devices:", e);
                } finally {
                    setLoadingDevices(false);
                }
            })();
        }
    }, [editEnabled]);

    useEffect(() => {
        if (isForm) {
            (async () => {
                await getAddress()
            })();
        }
    }, [selectedDevice, devices, form, getAddress]);

    const onSelectedDeviceChange = (val: string) => {
        const device = devices.find((d) => d.device_id === parseInt(val));
        if (device) {
            setSelectedDevice(device);
            form.setValue("device_id", val);
            form.setValue("x", device.pos.x,);
            form.setValue("y", device.pos.y,);
        }
    };

    const onSelectedPositionChange = (val: string) => {
        const position = positions.find((p) => p.id === parseInt(val));
        if (position) {
            setSelectedPosition(position);
            setSelectedDevice(null);
            form.setValue("positionId", val)
        }
    }

    const onChangeEdit = async (state: boolean) => {
        if (!state) {
            setSelectedPosition(null);
            setEditEnabled(state);
            form.reset({
                address: "",
                contacts: "",
                description: "",
                note: "",
                positionId: "",
            });
            await getAddress();
        } else {
            setSelectedDevice(null);
            setEditEnabled(state);
        }
    }

    const onPositionCreate = async (positionFormData: PositionFormData) => {
        try {
            const {data} = await axiosApi.get("/starline/devices");
            const fetchedDevices: Device[] = data.data.devices || [];
            const fetchedDevice = fetchedDevices.find((d) => d.device_id.toString() === positionFormData.device_id);

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

            await getPositions();

            form.reset();
            setSelectedDevice(null);
            setEditEnabled(false);
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
    };

    const onPositionEdit = async (positionFormData: PositionFormData) => {
        try {
            const payload = {
                ...positionFormData,
                x: selectedDevice ? selectedDevice.pos.x : positionFormData.x,
                y: selectedDevice ? selectedDevice.pos.y : positionFormData.y,
            }
            await axiosApi.patch(`/positions/${positionFormData.positionId}`, payload);
            toast({
                title: "Позиция отредактирована",
                description: positionFormData.name,
                duration: 5000,
            });
            await getPositions();
            form.reset();
            setSelectedPosition(null);
            setEditEnabled(false);
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
        loading,
        devices,
        selectedDevice,
        onSelectedDeviceChange,
        form,
        onPositionCreate: form.handleSubmit(onPositionCreate),
        onPositionEdit: form.handleSubmit(onPositionEdit),
        editEnabled,
        setEditEnabled,
        positions,
        selectedPosition,
        setSelectedPosition,
        onSelectedPositionChange,
        onChangeEdit,
        textLoading,
        getPositions
    };
};