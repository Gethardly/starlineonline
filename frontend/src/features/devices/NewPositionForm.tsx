import {type FC} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useNewPositionForm} from "@/features/hooks/useNewPositionForm.ts";

interface Props {
    onSubmit?: (payload: { select: string; input: string }) => void;
    initialValue?: string;
    options?: { value: string; label: string }[];
}

export const NewPositionForm: FC<Props> = () => {
    const {
        loading,
        inputValue,
        selectValue,
        devices,
        selectedDevicePos,
        handleSubmit,
        setSelectValue,
        setInputValue,
        posInfo
    } = useNewPositionForm();

    return (
        <Card className="w-full h-screen rounded-none">
            <CardHeader>
                <CardTitle>Добавлении новой локации</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                >
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="select">Выберите устройство</Label>
                        <Select
                            value={selectValue}
                            onValueChange={(val) => setSelectValue(val)}
                        >
                            <SelectTrigger id="select" className="w-full">
                                <SelectValue placeholder="Выбрать..."/>
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map((d, i) => (
                                    <SelectItem key={d.device_id} value={i.toString()}>
                                        {d.alias} {d.status === 1 ? '(В сети)' : '(Оффлайн)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="input">Название места</Label>
                        <Input
                            id="input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Введите текст"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Координаты</Label>
                        <p className="text-sm text-muted-foreground">
                            {selectedDevicePos.x}, {selectedDevicePos.y} г.{posInfo}
                        </p>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Отправка..." : "Отправить"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}