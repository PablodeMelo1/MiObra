import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
	const navigate = useNavigate()
	const { isAuthenticated, isLoading } = useAuth()

	useEffect(() => {
		if (isLoading) return
		if (!isAuthenticated) {
			navigate('/login')
		}
	}, [isAuthenticated, isLoading, navigate])

	if (isLoading) return null

	return (
		<div className="min-h-screen bg-[#0c0f14] text-white">
			<div className="flex min-h-screen items-start gap-4 px-6 py-5">
				<Sidebar />
			</div>
		</div>
	)
}

export default Dashboard
