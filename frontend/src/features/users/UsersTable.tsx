import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useUsersTable} from "@/features/hooks/useUsersTable.ts";
import {Button} from "@/components/ui/button.tsx";
import {Edit, Trash, Users} from "lucide-react";
import type {User} from "@/features/types.ts";
import type {FC} from "react";
import {Modal} from "@/common/Modal";
import {UserForm} from "@/features/users/UserForm.tsx";

interface Props {
    user: User | null;
}

export const UsersTable: FC<Props> = ({user}) => {
    const {
        form,
        users,
        existingUser,
        createUserModalOpen,
        setExistingUser,
        createOrUpdateUser,
        setCreateUserModalOpen,
        isUserDeleteSelected,
        setIsUserDeleteSelected,
        deleteUser
    } = useUsersTable();

    return (
        <>
            <div className="py-6 px-14 flex justify-end">
                <Button onClick={() => setCreateUserModalOpen(true)}>
                    <Users/> Создать пользователя
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Почта</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Действие</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setExistingUser(u)
                                                setCreateUserModalOpen(true)
                                            }}
                                    >
                                        <Edit className="w-2 h-2"/>
                                    </Button>
                                    <div title={user?.userId === u.id ? "Нельзя удалить себя" : ""}>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={user?.userId === u.id}
                                            onClick={() => setIsUserDeleteSelected(u.id)}
                                        >
                                            <Trash className="w-2 h-2"/>
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal title="Создание пользователя"
                   confirmText={existingUser ? "Редактировать" : "Создать"}
                   open={createUserModalOpen}
                   onConfirm={() => createOrUpdateUser()}
                   setOpen={setCreateUserModalOpen}
            >
                <UserForm existingUser={existingUser} form={form}/>
            </Modal>
            <Modal
                title="Удаление пользователя"
                description="Вы точно хотите удалить этого пользователя?"
                confirmText="Удалить"
                onConfirm={deleteUser}
                open={!!isUserDeleteSelected}
                setOpen={setIsUserDeleteSelected}
            >
                <p>Пользователь с ID {isUserDeleteSelected} будет удален</p>
            </Modal>
        </>
    )
}