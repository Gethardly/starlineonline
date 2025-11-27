import {type Dispatch, type FC, type SetStateAction, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Car, Loader2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import axiosApi from "@/axios.ts";
import {useNavigate} from "react-router-dom";
import type {Me} from "@/features/types.ts";

const loginSchema = z.object({
    email: z.string().email('Неверный email'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
    onLogin?: () => void;
    setAuth: Dispatch<SetStateAction<Me | null>>;
}

export const Login: FC<Props> = ({onLogin, setAuth}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const {data: login} = await axiosApi.post("/auth/login", {
                email: data.email,
                password: data.password
            });

            setAuth({
                success: true,
                user: login.user
            })

            localStorage.setItem("tkn", login["access_token"]);

            onLogin?.();
            if (login && login.user.id) {
                navigate("/");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-2xl bg-black/40 backdrop-blur-xl">
                    <CardHeader className="space-y-6 text-center">
                        <div
                            className="mx-auto size-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Car className="size-10 text-white"/>
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-white">StarLine</CardTitle>
                            <CardDescription className="text-gray-400 text-base mt-2">
                                Войдите в личный кабинет
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">
                                    Email или телефон
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="helloworld@hello.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-base focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">
                                    Пароль
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-base focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox"
                                           className="size-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"/>
                                    <span className="text-gray-400">Запомнить меня</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                        Вход...
                                    </>
                                ) : (
                                    'Войти'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Декоративные элементы */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-40 size-80 rounded-full bg-blue-500/10 blur-3xl"/>
                    <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-cyan-500/10 blur-3xl"/>
                </div>
            </div>
        </>
    );
}