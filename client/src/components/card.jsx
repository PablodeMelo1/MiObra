import { useNavigate } from 'react-router-dom';

function ProjectCard({ name, description, id }) {
    const navigate = useNavigate();
    const shortDescription = description
        ? (description.length > 50
            ? `${description.slice(0, 50).trimEnd()}...`
            : description)
        : 'Sin descripcion';

    return (
        <button
            type="button"
            className="h-36 min-w-0 w-full overflow-hidden rounded-lg border border-white/10 bg-[#1d222d] p-4 text-left transition-all duration-200 hover:bg-[#262626] hover:shadow-lg hover:shadow-black/40"
            onClick={() => navigate(`/projects/${id}`)}
        >
            <div className="h-full min-w-0 overflow-hidden">
                <h3 className="break-words text-base font-semibold leading-tight text-white">{name}</h3>
                <p className="mt-2 break-words text-sm leading-snug text-white/70">
                    {shortDescription}
                </p>
            </div>
        </button>
    )
}

export default ProjectCard
