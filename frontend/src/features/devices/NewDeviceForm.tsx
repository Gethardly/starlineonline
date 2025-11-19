import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNewDeviceForm} from "@/features/hooks/useNewDeviceForm.ts";

export const NewDeviceForm = () => {
    const {form, devices, loading, selectedDevice, onSelectChange, onSubmit} = useNewDeviceForm();

    return (<Card className="w-full rounded-none">
        <CardHeader>
            <CardTitle>Добавление нового устройства</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="device_id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Выберите устройство</FormLabel>
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
                                                {d.alias} {d.device_id}{" "}
                                                {d.status === 1 ? "(В сети)" : "(Оффлайн)"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-1 mb-1">
                        <Label>Наименование устройства</Label>
                        <p className="text-sm text-muted-foreground">
                            {selectedDevice?.alias}
                        </p>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Отправка..." : "Отправить"}
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>);
}