import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { getApiErrorMessage } from '../utils/apiError';

function VerifyEmailPage() {
  const { confirmEmailVerification } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verificando email...');

  useEffect(() => {
    let isMounted = true;

    const confirm = async () => {
      if (!token) {
        setStatus('error');
        setMessage('El link de verificacion no es valido.');
        return;
      }

      try {
        const response = await confirmEmailVerification(token);
        if (!isMounted) return;
        setStatus('success');
        setMessage(response.data?.message || 'Email verificado correctamente.');
      } catch (error) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(getApiErrorMessage(error, 'No se pudo verificar el email.'));
      }
    };

    confirm();

    return () => {
      isMounted = false;
    };
  }, [confirmEmailVerification, token]);

  return (
    <main className="grid min-h-screen bg-[#0c0f14] px-4 py-8 text-white sm:place-items-center">
      <section className="mx-auto w-full max-w-md self-center rounded-2xl border border-white/10 bg-[#111723] p-5 text-center shadow-2xl sm:p-8">
        <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200">MIOBRA</p>
        <h1 className="mt-2 text-2xl font-semibold">Verificacion de email</h1>
        <div className={`mt-6 rounded-lg border px-3 py-3 text-sm ${status === 'success' ? 'border-emerald-300/25 bg-emerald-500/10 text-emerald-50' : status === 'error' ? 'border-rose-300/25 bg-rose-500/10 text-rose-100' : 'border-cyan-300/25 bg-cyan-500/10 text-cyan-50'}`}>
          {status === 'loading' && <i className="fa-solid fa-spinner mr-2 animate-spin" aria-hidden="true" />}
          {message}
        </div>
        <Link to="/login" className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-[#071017] transition hover:bg-cyan-200">
          Ir a login
        </Link>
      </section>
    </main>
  );
}

export default VerifyEmailPage;
