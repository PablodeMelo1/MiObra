import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { getApiErrorMessage } from '../utils/apiError';

const inputClassName = 'w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-500/20';

function RegisterPage() {
  const { signUp, resendEmailVerification } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeInvitationToken = searchParams.get('employeeInvitationToken') || '';
  const [serverError, setServerError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched' });
  const clearServerError = () => setServerError('');

  const onSubmit = handleSubmit(async (data) => {
    try {
      setServerError('');
      const response = await signUp({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        companyName: data.companyName?.trim(),
        employeeInvitationToken: employeeInvitationToken || undefined,
      });
      setPendingVerification(response.data);
      setResendMessage('');
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'No se pudo crear la cuenta. Intenta nuevamente.'));
    }
  });

  const handleResend = async () => {
    if (!pendingVerification?.email) return;
    try {
      setServerError('');
      setResendMessage('');
      const response = await resendEmailVerification(pendingVerification.email);
      setPendingVerification((current) => ({ ...current, ...response.data }));
      setResendMessage('Enviamos un nuevo email de verificacion.');
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'No se pudo reenviar la verificacion.'));
    }
  };

  const fields = [
    { id: 'register-name', name: 'name', label: 'Nombre', type: 'text', autoComplete: 'name', placeholder: 'Tu nombre', rules: { required: 'Ingresa tu nombre.', minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres.' }, maxLength: { value: 40, message: 'El nombre no puede superar 40 caracteres.' } } },
    { id: 'register-email', name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'nombre@empresa.com', rules: { required: 'Ingresa tu email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ingresa un email valido.' } } },
  ];

  return (
    <main className="grid min-h-screen bg-[#0c0f14] px-4 py-8 text-white sm:place-items-center">
      <section className="mx-auto w-full max-w-md self-center rounded-2xl border border-white/10 bg-[#111723] p-5 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200">MIOBRA</p>
          <h1 className="mt-2 text-2xl font-semibold">Crear cuenta</h1>
          <p className="mt-2 text-sm text-white/55">Completa tus datos para comenzar.</p>
        </div>

        {pendingVerification ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-300/25 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-50">
              <p className="font-medium">Cuenta creada pendiente de verificacion.</p>
              <p className="mt-1 text-emerald-50/75">
                {pendingVerification.emailDeliveryStatus === 'failed'
                  ? `No pudimos enviar el link a ${pendingVerification.email}. Usa el reenvio para intentarlo nuevamente.`
                  : `Te enviamos un link a ${pendingVerification.email}. Verifica tu email para iniciar sesion.`}
              </p>
              {pendingVerification.devVerificationUrl && (
                <a className="mt-2 block break-all text-cyan-100 hover:underline" href={pendingVerification.devVerificationUrl}>Abrir link de verificacion local</a>
              )}
            </div>
            {resendMessage && <p className="text-sm text-cyan-100">{resendMessage}</p>}
            {serverError && <div role="alert" className="flex gap-2 rounded-lg border border-rose-300/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-100"><i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" /><span>{serverError}</span></div>}
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={handleResend} className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">Reenviar email</button>
              <button type="button" onClick={() => navigate('/login', { replace: true })} className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#071017] transition hover:bg-cyan-200">Ir a login</button>
            </div>
          </div>
        ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.id} className="mb-1.5 block text-sm text-white/75">{field.label}</label>
              <input id={field.id} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} aria-invalid={Boolean(errors[field.name])}
                {...register(field.name, { ...field.rules, onChange: clearServerError })} className={inputClassName} />
              {errors[field.name] && <p className="mt-1.5 text-xs text-rose-300">{errors[field.name].message}</p>}
            </div>
          ))}

          {!employeeInvitationToken && (
            <div>
              <label htmlFor="register-company" className="mb-1.5 block text-sm text-white/75">Empresa</label>
              <input id="register-company" type="text" autoComplete="organization" placeholder="Nombre de la empresa" aria-invalid={Boolean(errors.companyName)}
                {...register('companyName', {
                  required: 'Ingresa el nombre de la empresa.',
                  minLength: { value: 2, message: 'La empresa debe tener al menos 2 caracteres.' },
                  maxLength: { value: 80, message: 'La empresa no puede superar 80 caracteres.' },
                  onChange: clearServerError,
                })} className={inputClassName} />
              {errors.companyName && <p className="mt-1.5 text-xs text-rose-300">{errors.companyName.message}</p>}
            </div>
          )}

          {employeeInvitationToken && (
            <div className="rounded-lg border border-cyan-300/25 bg-cyan-500/10 px-3 py-2.5 text-sm text-cyan-100">
              Vas a crear tu cuenta y vincularla con tu ficha de empleado.
            </div>
          )}

          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-sm text-white/75">Contrasena</label>
            <div className="relative">
              <input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Entre 3 y 20 caracteres" aria-invalid={Boolean(errors.password)}
                {...register('password', { required: 'Ingresa una contrasena.', minLength: { value: 3, message: 'La contrasena debe tener al menos 3 caracteres.' }, maxLength: { value: 20, message: 'La contrasena no puede superar 20 caracteres.' }, onChange: clearServerError })}
                className={`${inputClassName} pr-11`} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-white/50 hover:text-white"><i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" /></button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-rose-300">{errors.password.message}</p>}
          </div>

          {serverError && <div role="alert" className="flex gap-2 rounded-lg border border-rose-300/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-100"><i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" /><span>{serverError}</span></div>}

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#071017] transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting && <i className="fa-solid fa-spinner animate-spin" aria-hidden="true" />}
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        )}

        {!pendingVerification && <p className="mt-5 text-center text-sm text-white/55">Ya tienes una cuenta? <Link to="/login" className="font-medium text-cyan-200 hover:text-cyan-100">Inicia sesion</Link></p>}
      </section>
    </main>
  );
}

export default RegisterPage;
