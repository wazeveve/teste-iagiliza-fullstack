import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Profile() {
    const [user, setUser] = useState({ name: "", email: ""});
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/me").then((res) => setUser(res.data));
    }, []);

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.patch("/me", user);
            setMessage("Updated Successfuly!");
        } catch {
            setMessage("Error in updating profile.");
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({...user, [e.target.name]: e.target.value});
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleUpdate} className="bg-gray-800 p-8 rounded-xl shadow-md w-96 space-y-4">
                <h1 className="text-2xl font-bold text-center mb-4"> Perfil </h1>
                <input name="name" value={user.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-gray-700 focus: outline-none" />
                <input name="email" value={user.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded bg-gray-700 focus: outline-none" />

                {message && <p className="text-yellow-400 text-sm">{message}</p>}

                <button type="submit" className="bg-blue-500 hover: bg-blue-600 w-full py-2 rounded mt-4"> Update </button>
            </form>
        </div>
    );
}