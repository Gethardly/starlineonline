import {Navigate, Outlet} from "react-router-dom";
import {type FC} from "react";

interface Props {
    loading?: boolean;
    isAuthenticated?: boolean;
}

export const ProtectedRoute: FC<Props> = ({loading, isAuthenticated}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Проверка авторизации...</div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Outlet/>
    } else {
        return <Navigate to="/login" replace/>;
    }

};