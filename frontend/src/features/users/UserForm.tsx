import {type FC, useState} from "react";
import type {UseFormReturn} from "react-hook-form";
import {type User} from "@/features/types.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {roles} from "@/features/hooks/useUsersTable.ts";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Props {
    existingUser?: User | null;
    form: UseFormReturn<{
        name: string
        email: string
        role: string
        password?: string | undefined
    }>
}

export const UserForm: FC<Props> = ({existingUser, form}) => {
    const [passwordInputType, setPasswordInputType] = useState(true);

    return (
        <Card className="w-full rounded-none">
            <CardHeader className="flex flex-row items-center">
                <CardTitle>
                    {!!existingUser
                        ? "Редактирование пользователя"
                        : "Создание пользователя"
                    }
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите имя" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Почта</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите почту" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Выберите роль
                                    </FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(val.toString())
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите роль"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map((r) => (
                                                <SelectItem
                                                    key={r}
                                                    value={r}
                                                >
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="relative w-full">
                                                <Input
                                                    type={passwordInputType ? "password" : "text"}
                                                    placeholder="Введите пароль"
                                                    {...field}
                                                    className="pr-10" // оставляем место для кнопки справа
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setPasswordInputType(!passwordInputType)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                                >
                                                    {passwordInputType ? <EyeOff size={16}/> : <Eye size={16}/>}
                                                </Button>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}