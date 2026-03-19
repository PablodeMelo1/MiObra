import Project from '../model/project-schema.mjs'
import ProjectMember from '../model/projectMember-schema.mjs'

export default class projectMongoRepository {
    /**
     * Create a project. Accepts an optional mongoose session for transactions.
     * @param {Object} data
     * @param {mongoose.ClientSession} [session]
     */
    async createOne(data, session = null) {
        try {
            if (session) {
                const [created] = await Project.create([data], { session });
                return created;
            }
            const newProject = new Project(data);
            const projectSave = await newProject.save();
            return projectSave;
        } catch (error) {
            console.log('Error creating the project: ', error);
            throw error;
        }
    }

    async getAll() {
        return Project.find();
    }

    async getById(data) {
        return Project.findOne(data);
    }

    async getByUserId(userIdInput) {
        const userId = typeof userIdInput === 'string' ? userIdInput : userIdInput?.userId;
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

    async updateById(data, updateData = {}) {
        try {
            const id = data && data._id ? data._id : null;
            if (!id) {
                throw new Error('Project id is required');
            }

            return await Project.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
        } catch (error) {
            console.log('error updating project', error);
            throw error;
        }
    }
    
}