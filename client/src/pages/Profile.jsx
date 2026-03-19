import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/user';

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      if (!user?._id && !user?.id) {
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setError('');
        const userId = user._id || user.id;
        const response = await getUserProfile(userId);
        const profile = response.data?.user || response.data;

        setForm({
          name: profile?.name || '',
          email: profile?.email || '',
        });
      } catch (fetchError) {
        console.error('Error fetching profile:', fetchError);
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleChange = (field, value) => {
    setMessage('');
    setError('');
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = user?._id || user?.id;
    if (!userId) {
      setError('No se pudo identificar el usuario autenticado.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      setError('');

      await updateUserProfile(userId, {
        name: form.name.trim(),
        email: form.email.trim(),
      });

      setMessage('Perfil actualizado correctamente.');
    } catch (submitError) {
      console.error('Error updating profile:', submitError);
      setError('No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loadingProfile) return null;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white">
      <div className="flex min-h-screen items-start gap-4 px-6 py-5">
        <Sidebar />

        <section className="flex-1 p-3">
          <div className="mb-3">
            <h1 className="text-lg font-semibold">Perfil</h1>
            <p className="text-xs text-white/60">Visualiza y edita tus datos de usuario</p>
          </div>

          <ProfileForm
            form={form}
            saving={saving}
            message={message}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    </div>
  );
}

export default Profile;
