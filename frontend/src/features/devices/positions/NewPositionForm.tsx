import {type FC} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useNewPositionForm} from "@/features/hooks/useNewPositionForm.ts";
import {PhoneInput} from "@/components/PhoneInput.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import { PositionAutocomplete } from "./components/PositionAutocomplete";

export const NewPositionForm: FC = () => {
    const {
        loading,
        devices,
        onSelectedDeviceChange,
        selectedDevice,
        selectedPosition,
        form,
        onPositionCreate,
        onPositionEdit,
        editEnabled,
        onChangeEdit,
        positions,
        onSelectedPositionChange,
        textLoading,
    } = useNewPositionForm(true);

    return (
        <Card className="w-full rounded-none">
            <CardHeader className="flex flex-row items-center">
                <CardTitle>
                    {editEnabled
                        ? "Редактирование локации"
                        : "Добавление новой локации"
                    }
                </CardTitle>
                <div className="flex items-center space-x-2 ml-10">
                    <Switch
                        checked={editEnabled}
                        onCheckedChange={onChangeEdit}
                        id="airplane-mode"
                    />
                    <Label htmlFor="airplane-mode">
                        {editEnabled ? "Редактирование" : "Создание"}
                    </Label>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={editEnabled ? onPositionEdit : onPositionCreate} className="flex flex-col gap-3">
                        {editEnabled && <FormField
                            control={form.control}
                            name="positionId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Выберите локацию
                                    </FormLabel>

                                    <PositionAutocomplete
                                        positions={positions}
                                        value={field.value?.toString()}
                                        onChange={(val) => {
                                            field.onChange(val.toString())
                                            onSelectedPositionChange(val)
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                        }
                        <FormField
                            control={form.control}
                            name="device_id"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Выберите позицию устройства
                                    </FormLabel>
                                    <Select
                                        value={field.value.toString()}
                                        onValueChange={(val) => {
                                            field.onChange(val.toString());
                                            onSelectedDeviceChange(val);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={editEnabled ? "Выберите устройство для установки новой позиции" : textLoading}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {devices.map((d) => (
                                                <SelectItem
                                                    key={d.deviceId}
                                                    value={d.deviceId.toString()}
                                                >
                                                    {d.alias}{" "}
                                                    {d.status === 1 ? "(В сети)" : "(Оффлайн)"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Название места</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите название" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="positionNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Номер позиции</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите номер позиции"
                                               type="number"
                                               {...field}
                                               onChange={(e) => {
                                                   field.onChange(parseInt(e.target.value));
                                               }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Адрес</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={textLoading}
                                            disabled={!editEnabled}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contacts"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Контакты</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col gap-1 mb-1">
                            <Label>Координаты</Label>
                            <p className="text-sm text-muted-foreground">
                                {selectedDevice ? selectedDevice.pos.x : selectedPosition?.x || 0}, {" "}
                                {selectedDevice ? selectedDevice?.pos?.y : selectedPosition?.y || 0}
                            </p>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Описание</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Введите описание..."
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Примечание</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Введите примечание..."
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Отправка..." : "Отправить"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};