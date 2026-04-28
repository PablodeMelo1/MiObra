import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context';


function RegisterPage() {
  const { signUp, isAuthenticated, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      const res = await signUp(data);
      if (res.status === 201) {
        setMessage("Usuario registrado exitosamente");
        setErrorMessage("");
        navigate("/dashboard");
      }
    } catch (error) {
      const text = error.response?.data?.message ?? "Error al registrar el usuario";
      setMessage("");
      setErrorMessage(text);
    }
  });


  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800 text-white px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-zinc-900/60 backdrop-blur-sm p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Crear cuenta</h2>
        <input type="text" placeholder='Nombre' {...register("name", { required: true, onChange: () => { setErrorMessage(""); setMessage(""); } })} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md" />
        {errors.name && <p className="text-red-500 text-sm">El nombre es requerido</p>}
        <input type="email" placeholder='Email' {...register("email", { required: true, onChange: () => { setErrorMessage(""); setMessage(""); } })} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md" />
        {errors.email && <p className="text-red-500 text-sm">El email es requerido</p>}
        <input type="password" placeholder='Password' {...register("password", { required: true, onChange: () => { setErrorMessage(""); setMessage(""); } })} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md" />
        {errors.password && <p className="text-red-500 text-sm">La contraseña es requerida</p>}
        {errorMessage && <p className="py-2 px-3 bg-red-500 text-zinc-900 text-center font-medium rounded-md text-sm mt-1">{errorMessage}</p>}
        {message && <p className="py-2 px-3 bg-green-500 text-zinc-900 text-center font-medium rounded-md text-sm mt-1">{message}</p>}
        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-zinc-900 font-medium py-2 rounded-md">Registrar</button>
      </form>
    </div>
  )
}

export default RegisterPage
