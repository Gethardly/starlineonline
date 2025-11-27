import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosApi from "@/axios.ts";
import type {Me} from "@/features/types";

const initialState: Me = {
    success: false,
    user: null
};

export const useAuth = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const {data} = await axiosApi.get<Me>("/auth/me");
                if (mounted) {
                    setAuth(data.success ? data : initialState);
                    setIsAuthenticated(data.success === true);
                }
            } catch (e) {
                if (mounted) {
                    setAuth(initialState);
                }
                console.log(e);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        })();

        const handler = () => {
            setIsAuthenticated(localStorage.getItem("tkn") !== null);
        };

        window.addEventListener("storage", handler);

        return () => {
            mounted = false;
            window.removeEventListener("storage", handler);
        };
    }, [isAuthenticated]);

    const logout = () => {
        setAuth(null);
        setIsAuthenticated(false);
        localStorage.clear();
        sessionStorage.clear();
        document.cookie
            .split(";")
            .forEach(
                (c) =>
                    (document.cookie = c
                        .split("=")[0]
                        .trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/")
            );
        navigate('/login');
    }

    return {
        isAuthenticated,
        user: auth?.user || null,
        loading,
        setIsAuthenticated,
        logout,
        setAuth
    };
};