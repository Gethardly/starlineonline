import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useNewPositionForm} from "@/features/hooks/useNewPositionForm.ts";
import {Trash} from "lucide-react";
import {Modal} from "@/common/Modal.tsx";
import {usePositionsTable} from "@/features/hooks/usePositionsTable.ts";

export const PositionsTable = () => {
    const {positions} = useNewPositionForm(false);
    const {isPositionDeleteSelected, setIsPositionDeleteSelected, handleDelete} = usePositionsTable();
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Номер позиции</TableHead>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Контакты</TableHead>
                        <TableHead>Действие</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positions.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.id}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.positionNumber}</TableCell>
                            <TableCell>{p.address}</TableCell>
                            <TableCell>{p.contacts}</TableCell>
                            <TableCell>
                                <Button variant="destructive" size="sm"
                                        onClick={() => setIsPositionDeleteSelected(p.id)}>
                                    <Trash className="w-2 h-2"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal
                title="Удаление локации"
                description="Вы точно хотите удалить эту локацию?"
                confirmText="Удалить"
                onConfirm={handleDelete}
                open={!!isPositionDeleteSelected}
                setOpen={setIsPositionDeleteSelected}
            >
                <p>Эта локация с ID {isPositionDeleteSelected} будет удалена</p>
            </Modal>
        </>
    )
}