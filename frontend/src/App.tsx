import {Route, Routes} from "react-router-dom";
import {Auth} from "@/features/auth/Auth.tsx";
import {ProtectedRoute} from "@/features/auth/ProtectedRoute.tsx";
import {useAuth} from "@/features/hooks/useAuth.ts";
import {Toaster} from "./components/ui/toaster";
import {TabBar} from "@/common/TabBar.tsx";

export default function App() {
    const {loading, isAuthenticated} = useAuth();

    return (
        <>
            <Routes>
                <Route path="*" element={"Not found"}/>
                <Route path="/login" element={<Auth/>}/>

                <Route element={<ProtectedRoute loading={loading} isAuthenticated={isAuthenticated}/>}>
                    <Route path="/" element={<TabBar/>}/>
                </Route>
            </Routes>
            <Toaster/>
        </>
    );
}