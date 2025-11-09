import { useState } from 'react';
import { api } from "../services/api";
import { z } from "zod";


const RegisterSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        const parsed = RegisterSchema.safeParse(form);
        if (!parsed.success) {
            setError(parsed.error.errors[0].message);
            return;
        }

        try {
            await api.post("register", form);
            setSuccess("Successfully registered! Go to login page.");
            setForm({ name: "", email: "", password: ""});
        } catch (err: any) {
            setError("Error in registering user.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-md w-96 space-y-4">
                <h1 className= "text-2xl font-bold text-center mb-4">Register</h1>

                <input name="name" placeholder = "Name" value = {form.name} onChange = {handleChange} className="w-full p2 rounded bg-gray-700 focus:outline-none"/>
                <input name="email" placeholder = "Email" value = {form.email} onChange = {handleChange} className = "w-full p2 rounded bg-gray-700 focus: outline-none" />
                <input name="password" placeholder = "Password" type = "password" value = {form.password} onChange = {handleChange} className = "w-full p-2 rounded bg-gray-700 focus:outline-none" />

                {error && <p className = "text-red-400 text-sm">{error}</p>}
                {success && <p className = "text-green-400 text-sm">{success}</p>}

            <button type="submit" className = "bg-blue-500 hover:bg-blue-600 w-full py-2 rounded mt-4"> Cadastrar </button>

            </form>
        </div>
    );
}