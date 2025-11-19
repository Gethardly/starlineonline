import {TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";
import {Tabs} from "@/components/ui/tabs.tsx";
import {NewPositionForm} from "@/features/devices/NewPositionForm.tsx";
import {NewDeviceForm} from "@/features/devices/NewDeviceForm.tsx";

export const TabBar = () => {
    return (
        <Tabs defaultValue="form1">
            <TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-xl">
                <TabsTrigger
                    value="form1"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                 rounded-lg transition-all text-sm font-medium"
                >
                    Добавление позиции
                </TabsTrigger>

                <TabsTrigger
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
                </TabsTrigger>
            </TabsList>

            <TabsContent value="form1">
                <NewPositionForm/>
            </TabsContent>
            <TabsContent value="form2">
                <NewDeviceForm/>
            </TabsContent>
            <TabsContent value="form3">
                <h3>form 3</h3>
            </TabsContent>
        </Tabs>
    )
}