import ProjectCard from '../card';

function ProjectsList({ projects }) {
  if (projects.length === 0) {
    return <p className="ml-5 text-white/60">No hay proyectos disponibles</p>;
  }

  return projects.map((project) => (
    <ProjectCard
      key={project._id || project.id}
      id={project._id || project.id}
      name={project.name || project.projectName}
      description={project.description}
    />
  ));
}

export default ProjectsList;
