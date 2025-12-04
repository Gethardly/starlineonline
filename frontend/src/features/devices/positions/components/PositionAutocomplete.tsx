import {type FC, useState} from "react"
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import type {Position} from "@/features/types.ts";

interface Props {
    positions: Position[];
    value: string | undefined;
    onChange: (positionId: string) => void;
}

export const PositionAutocomplete: FC<Props> = ({positions, value, onChange}) => {
    const [open, setOpen] = useState(false)

    const selected = positions.find((p) => p.id.toString() === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full border rounded p-2 text-left">
                {selected ? selected.name : "Выберите позицию..."}
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[400px]">
                <Command>
                    <CommandInput placeholder="Поиск..."/>

                    <CommandList>
                        <CommandEmpty>Ничего не найдено</CommandEmpty>

                        <CommandGroup>
                            {positions.map((p) => (
                                <CommandItem
                                    key={p.id}
                                    value={p.id.toString()}
                                    keywords={[p.name]}
                                    onSelect={() => {
                                        onChange(p.id.toString())
                                        setOpen(false)
                                    }}
                                >
                                    {p.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}