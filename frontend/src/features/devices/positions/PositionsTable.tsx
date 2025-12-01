import {type FC} from 'react';
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Trash} from "lucide-react";
import {Modal} from "@/common/Modal.tsx";
import {usePositionsTable} from "@/features/hooks/usePositionsTable.ts";
import type {User} from "@/features/types.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from '@/components/ui/input';

interface Props {
    user: User | null;
}

export const PositionsTable: FC<Props> = ({user}) => {
    const {
        positions,
        isPositionDeleteSelected,
        setIsPositionDeleteSelected,
        handleDelete,
        exportToExcel,
        pageSize,
        setPageSize,
        handleNext,
        handlePrev,
        currentPage,
        totalPages,
        search,
        setSearch
    } = usePositionsTable();
    return (
        <div>
            <div className="w-[450px] px-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
                            Пред
                        </Button>
                        <span className="mx-2">
            {currentPage} / {pageSize === 0 ? 1 : totalPages}
          </span>
                        <Button variant="outline" size="sm" onClick={handleNext}
                                disabled={(currentPage === totalPages) || (pageSize === 0)}>
                            След
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Размер старницы:</span>
                        <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder="10"/>
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50, 0].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size === 0 ? 'Все' : size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Input
                        placeholder="Поиск по названию..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-4"
                    />
                </div>
            </div>

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
                                <div title={user?.role !== 'admin' ? 'Удалять локации может только админ' : ''}>
                                    <Button variant="destructive" size="sm"
                                            onClick={() => setIsPositionDeleteSelected(p.id)}
                                            disabled={user?.role !== 'admin'}
                                    >
                                        <Trash className="w-2 h-2"/>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end pr-5 pt-2">
                <Button onClick={exportToExcel}>Экспорт в эксель</Button>
            </div>
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
        </div>
    )
}