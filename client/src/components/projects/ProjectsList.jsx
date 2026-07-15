import ProjectCard from '../card';

function ProjectsList({ projects }) {
  if (projects.length === 0) {
    return <p className="border-l-2 border-white/15 bg-white/[0.025] p-5 text-sm text-white/60">No hay proyectos disponibles</p>;
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project._id || project.id}
          id={project._id || project.id}
          name={project.name || project.projectName}
          description={project.description}
        />
      ))}
    </div>
  );
}

export default ProjectsList;
