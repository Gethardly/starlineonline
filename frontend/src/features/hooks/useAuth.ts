import {useEffect, useState} from "react";
import axiosApi from "@/axios.ts";
import type {Me} from "@/features/types";

const initialState: Me = {
    success: false,
    user: null
};

export const useAuth = () => {
    const [auth, setAuth] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const {data} = await axiosApi.get<Me>("/auth/me");
                if (mounted) {
                    setAuth(data.success ? data : initialState);
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

        return () => {
            mounted = false;
        };
    }, []);

    const isAuthenticated = auth?.success === true;

    return {
        isAuthenticated,
        user: auth?.user || null,
        loading,
    };
};