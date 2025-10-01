import type { AxiosError } from "axios";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface LoginData {
  email: string;
  password: string
}

interface LoginResponse {
  token: string;
  name: string;
  email: string;

}

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<LoginResponse>("/login", { email, password } satisfies LoginData);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userName", res.data.name);
      sessionStorage.setItem("userEmail", res.data.email);
      onLogin();
      console.log(res)
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Signup failed");
    }
    // For demo: just save name in state
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto mt-[50%]">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="bg-green-600 text-white py-2 px-4 rounded w-full">
        Login
      </button>
    </form>
  );
}
