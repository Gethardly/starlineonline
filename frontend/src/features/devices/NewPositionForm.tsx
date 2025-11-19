import {type FC} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {useNewPositionForm} from "@/features/hooks/useNewPositionForm";
import {PhoneInput} from "@/components/PhoneInput.tsx";

export const NewPositionForm: FC = () => {
    const {
        loading,
        devices,
        posInfo,
        onSelectChange,
        selectedDevice,
        form,
        onSubmit,
    } = useNewPositionForm();

    return (
        <Card className="w-full rounded-none">
            <CardHeader>
                <CardTitle>Добавление новой локации</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="device_id"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Выберите позицию устройства</FormLabel>
                                    <Select
                                        value={field.value.toString()}
                                        onValueChange={(val) => {
                                            field.onChange(val.toString());
                                            onSelectChange(val);
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выбрать..."/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {devices.map((d) => (
                                                <SelectItem
                                                    key={d.device_id}
                                                    value={d.device_id.toString()}
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
                            name="address"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Адрес</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите адрес"
                                            disabled={!!posInfo}
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
                                {selectedDevice?.pos?.x || 0}, {selectedDevice?.pos?.y || 0}
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