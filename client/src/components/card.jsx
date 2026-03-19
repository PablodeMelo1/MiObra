import { useNavigate } from 'react-router-dom';

function ProjectCard({ name, description, id }) {
    const navigate = useNavigate();
    const shortDescription = description
        ? (description.length > 50
            ? `${description.slice(0, 50).trimEnd()}...`
            : description)
        : 'Sin descripcion';

    return (
        <div 
            className='m-5 h-36 w-full max-w-sm cursor-pointer rounded-lg border border-white/10 bg-[#1d222d] p-4 transition-all duration-200 hover:bg-[#262626] hover:shadow-lg hover:shadow-black/40' 
            onClick={() => navigate(`/projects/${id}`)}
        >
            <div className='h-full text-left overflow-hidden'>
                <h3 className='text-white text-base font-semibold leading-tight'>{name}</h3>
                <p className='mt-2 text-sm text-white/70 leading-snug'>
                    {shortDescription}
                </p>
            </div>
        </div>
    )
}

export default ProjectCard