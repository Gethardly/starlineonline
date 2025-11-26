import type {FC, ReactNode} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalProps {
    trigger?: ReactNode;
    title?: string;
    description?: string;
    children: ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    cancelText?: string;
    open?: boolean;
    setOpen?: (value: boolean) => void;
}

export const Modal: FC<ModalProps> = ({
                                                trigger,
                                                title,
                                                description,
                                                children,
                                                confirmText = "Подтвердить",
                                                onConfirm,
                                                cancelText = "Отмена",
                                                open,
                                                setOpen,
                                            }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                {title || description ? (
                    <DialogHeader>
                        {title && <DialogTitle>{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                ) : null}

                <div className="my-4">{children}</div>

                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen?.(false)}>
                        {cancelText}
                    </Button>
                    {onConfirm && (
                        <Button className="mb-3" onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};