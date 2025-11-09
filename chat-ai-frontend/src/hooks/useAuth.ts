import { useState, useEffect } from "react";
import { api } from "../services/api";


export function useAuth() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api.get("/me").then((res) => setUser(res.data));
        }
    }, []);

    function login(token: string) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        api.get("/me").then((res) => setUser(res.data));
    }

    function logout(){
        localStorage.removeItem("token");
        setUser(null);
    }

    return {user, login, logout};
}