import {Route, Routes} from "react-router-dom";
import {Login} from "@/features/auth/Login.tsx";
import {ProtectedRoute} from "@/features/auth/ProtectedRoute.tsx";
import {Toaster} from "./components/ui/toaster";
import {TabBar} from "@/common/TabBar.tsx";
import {useAuth} from "@/features/hooks/useAuth.ts";

export default function App() {
    const {loading, user, isAuthenticated, setIsAuthenticated, logout} = useAuth();

    return (
        <>
            <Routes>
                <Route path="*" element="Not found"/>
                <Route path="/login"
                       element={<Login onLogin={() => setIsAuthenticated(localStorage.getItem("tkn") !== null)}/>}/>

                <Route element={<ProtectedRoute loading={loading} isAuthenticated={isAuthenticated}/>}>
                    <Route path="/" element={<TabBar user={user} logout={logout}/>}/>
                </Route>
            </Routes>
            <Toaster/>
        </>
    );
}