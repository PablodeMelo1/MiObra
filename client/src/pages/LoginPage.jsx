import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

function LoginPage() {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setMessage("");
      setErrorMessage("");
      const res = await signIn(data);
      if (res.status === 200) {
        setMessage("Usuario logueado exitosamente");
        setErrorMessage("");
        navigate("/dashboard");
      }
    } catch (error) {
      const text = error.code === "ECONNABORTED"
        ? "La API no respondio. Intenta nuevamente en unos segundos."
        : error.response?.data?.message ?? "Error al iniciar sesion";
      setMessage("");
      setErrorMessage(text);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800 text-white px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar sesion</h2>
        <input type="email" placeholder="Email" {...register("email", { required: true, onChange: () => { setErrorMessage(""); setMessage(""); } })} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md" />
        <input type="password" placeholder="Password" {...register("password", { required: true, onChange: () => { setErrorMessage(""); setMessage(""); } })} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md" />
        {errorMessage && <p className="py-2 px-3 bg-red-500 text-zinc-900 text-center font-medium rounded-md text-sm mt-1">{errorMessage}</p>}
        {message && <p className="py-2 px-3 bg-green-500 text-zinc-900 text-center font-medium rounded-md text-sm mt-1">{message}</p>}
        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-zinc-900 font-medium py-2 rounded-md">Iniciar sesion</button>
        <a href="/register" className="block mt-4 text-center text-sm text-white/70 hover:text-white">No tienes una cuenta? Registrate</a>
      </form>
    </div>
  );
}

export default LoginPage;
