import Project from '../model/project.mjs'
import ProjectMember from '../model/projectMember.mjs'

export default class projectMongoRepository {

    async createOne(data) {
        try {
            const newProject = new Project(data);
            const projectSave = await newProject.save();
            return projectSave;
        } catch (error) {
            console.log('Error creating the project: ', error);
        }
    }

    async getAll() {
        return Project.find();
    }

    async getById(data) {
        return Project.findOne(data);
    }

    async getByUserId(userId) {
        const projectMembers = await ProjectMember.find({ userId });
        const projectIds = projectMembers.map(pm => pm.projectId);
        return Project.find({ _id: { $in: projectIds } });
    }


    async deleteById(data) {
        try {
            const { _id } = data;
            if (!_id) {
                console.log('Error deleting project: not come id by params', error);
            }
            const project = Project.findOne(_id);
            if (!project) {
                console.log('Error deleting project: incorrect id', error);
            }
            await Project.deleteOne({ _id });
        } catch (error) {
            console.log('Error deleting project', error)
        }
    }
    async duplicateProject(data) {
        try {
            const { _id, ...projectData } = data;
            const newProject = new Project(projectData);
            return await newProject.save();
        } catch (error) {
            console.log('Error duplicating project', error)
        }
    }

    async updateById(data){
        try {
            const { _id } = data;
            if(!_id) console.log('error user id not found', error)
            await Project.findByIdAndUpdate(_id, data);
        } catch (error) {
            console.log('error updating project', error)
        }
    }
    
}