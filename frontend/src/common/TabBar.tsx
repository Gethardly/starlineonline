import {TabsContent, TabsList} from "@radix-ui/react-tabs";
import {Tabs, TabsTrigger} from "@/components/ui/tabs.tsx";
import {NewPositionForm} from "@/features/devices/positions/NewPositionForm.tsx";
import {PositionsTable} from "@/features/devices/positions/PositionsTable.tsx";
import {UsersTable} from "@/features/users/UsersTable";
import type {User} from "@/features/types";
import {type FC, useState} from "react";
import {LogOutIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Modal} from "@/common/Modal.tsx";
import {DevicesTable} from "@/features/devices/DevicesTable.tsx";

interface Props {
    user: User | null;
    logout: () => void;
}

export const TabBar: FC<Props> = ({user, logout}) => {
    const [logoutOpen, setLogoutOpen] = useState(false);

    return (
        <>
            <Tabs defaultValue="newPosition">
                <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1">
                    <TabsTrigger
                        value="newPosition"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 transition-all text-sm font-medium"
                    >
                        Добавление локации
                    </TabsTrigger>
                    <TabsTrigger
                        value="locations-list"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 transition-all text-sm font-medium"
                    >
                        Список локаций
                    </TabsTrigger>
                    {user?.role === 'admin' && (
                        <>
                            <TabsTrigger
                                value="users-list"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 transition-all text-sm font-medium"
                            >
                                Список пользователей
                            </TabsTrigger>
                            <TabsTrigger
                                value="devices-list"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 rounded-lg transition-all text-sm font-medium"
                            >
                                Список устройств
                            </TabsTrigger>
                        </>
                    )}
                    {/*

                <TabsTrigger
                    value="form3"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 rounded-lg transition-all text-sm font-medium"
                >
                    Добавление истории
                </TabsTrigger>*/}
                </TabsList>

                <TabsContent value="newPosition">
                    <NewPositionForm/>
                </TabsContent>
                <TabsContent value="locations-list">
                    <PositionsTable user={user}/>
                </TabsContent>
                {
                    user?.role === 'admin' && (
                        <>
                            <TabsContent value="users-list">
                                <UsersTable user={user}/>
                            </TabsContent>
                            <TabsContent value="devices-list">
                                <DevicesTable/>
                            </TabsContent>
                        </>
                    )
                }
                {/*
            <TabsContent value="form3">
                <h3>form 3</h3>
            </TabsContent>*/}
            </Tabs>
            <div className="flex justify-end px-10 py-5">
                <Button onClick={() => setLogoutOpen(true)} title="Выйти">
                    <LogOutIcon/>
                </Button>
                <Modal
                    title="Выход из приложения"
                    confirmText="Выйти"
                    open={logoutOpen}
                    setOpen={setLogoutOpen}
                    onConfirm={logout}
                >
                    <p>Вы действительно хотите выйти?</p>
                </Modal>
            </div>
        </>
    )
}