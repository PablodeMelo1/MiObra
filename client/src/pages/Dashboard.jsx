import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import LoadingScreen from '../components/routing/LoadingScreen'
import { useAuth } from '../context/auth-context'

function Dashboard() {
	const navigate = useNavigate()
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (isLoading) return
		if (!isAuthenticated) {
			navigate('/login')
		}
	}, [isAuthenticated, isLoading, navigate])

	if (isLoading) return <LoadingScreen message="Cargando dashboard..." />

	return (
		<div className="min-h-screen bg-[#0c0f14] text-white">
			<div className="flex min-h-screen flex-col items-stretch gap-4 px-3 py-3 sm:px-5 lg:flex-row lg:items-start lg:px-6 lg:py-5">
				<Sidebar />
			</div>
		</div>
	)
}

export default Dashboard
