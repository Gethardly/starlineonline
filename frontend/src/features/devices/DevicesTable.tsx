import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useEffect, useState} from "react";
import type {Device} from "@/features/types.ts";
import axiosApi from "@/axios.ts";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "lucide-react";

export const DevicesTable = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(false);

    const getDevices = async () => {
        try {
            setLoading(true);
            const {data} = await axiosApi.get("/devices");
            setDevices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await getDevices();
        })()
    }, [])
    return (
        <div>
            {loading && <Loader/>}
            <div className="my-3 px-4 flex justify-end">
                <Button variant="outline" onClick={getDevices}>Синхронизировать список устройств</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>ID устройства</TableHead>
                        <TableHead>Imei</TableHead>
                        <TableHead>Создан</TableHead>
                        <TableHead>Обновлен</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devices.slice()
                        .sort((a, b) => {
                            if (a.id === undefined) return 1;
                            if (b.id === undefined) return -1;
                            return a.id - b.id;
                        })
                        .map((device) => (
                        <TableRow key={device.id}>
                            <TableCell>{device.id}</TableCell>
                            <TableCell>{device.alias}</TableCell>
                            <TableCell>{device.deviceId}</TableCell>
                            <TableCell>{device.imei}</TableCell>
                            <TableCell>{device.createdAt}</TableCell>
                            <TableCell>{device.updatedAt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}