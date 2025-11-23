import {TabsContent, TabsList} from "@radix-ui/react-tabs";
import {Tabs, TabsTrigger} from "@/components/ui/tabs.tsx";
import {NewPositionForm} from "@/features/devices/positions/NewPositionForm.tsx";
import {PositionsTable} from "@/features/devices/positions/PositionsTable.tsx";

export const TabBar = () => {
    return (
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
                {/*<TabsTrigger
                    value="form2"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 rounded-lg transition-all text-sm font-medium"
                >
                    Добавление устройства
                </TabsTrigger>

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
                <PositionsTable/>
            </TabsContent>
            {/*<TabsContent value="form2">
                <NewDeviceForm/>
            </TabsContent>
            <TabsContent value="form3">
                <h3>form 3</h3>
            </TabsContent>*/}
        </Tabs>
    )
}