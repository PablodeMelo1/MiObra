import Task from '../model/task-schema.mjs'

export default class taskMongoRepository {

    async createOne(data) {
        try {
            const newTask = new Task(data);
            const task = await newTask.save();
            console.log('Task created:', task);
            return task;
        } catch (error) {
            throw new Error('error creating a tast');
        }
    }

    async getAll(companyId) {
        return await Task.find({ companyId });
    }

    async getAllByProjectId(projectId, companyId) {
        return await Task.find({ projectId, companyId });
    }

    async getAllTasksByProject(projectId) {
        return await Task.find({ project: projectId });
    }

    async getByUserAndProject(data) {
        const { userId, project, companyId } = data;
        return await Task.find({ assignedTo: userId, projectId: project, companyId });
    }

    async getById(data) {
        return Task.findOne(data);
    }

    async getByIdAndProject(data) {
        const { _id, project, projectId, companyId } = data;
        const effectiveProjectId = projectId || project;
        return Task.findOne({ _id, projectId: effectiveProjectId, companyId });
    }

    async deleteById(data) {
        try {
            const { _id } = data;
            if (!_id) {
                throw new Error("Error al obtener el id")
            }
            const task = await Task.findOne({ _id, companyId: data.companyId });
            if (!task) {
                throw new Error("Task with this id not found");
            }
            return await Task.findOneAndDelete({ _id, companyId: data.companyId });
        } catch (error) {
            throw new Error('error deleting a tast');
        }
    }
    //reemplaza el viejo por el nuevo
    async replaceTask(data) {
        return Task.findOneAndReplace(data);
    }
    //actualiza la tarea
    async updateTask(data) {
        const { _id, projectId, companyId, ...updateData } = data;
        return Task.findOneAndUpdate({ _id, projectId, companyId }, updateData, { new: true });
    }

    async getTasksByList(data) {
        const { projectId, list, companyId } = data;
        return Task.find({ projectId, list, companyId });
    }

    async getTasksByContextText({ text }) {
        const regex = new RegExp(text, 'i');
        return Task.find({ context: { $regex: regex } });
    }

    async getTasksByContextTextAndProject({ text, project }) {
        const regex = new RegExp(text, 'i');
        return Task.find({
            context: { $regex: regex },
            project
        });
    }

    async updateStatus(data) {
        const { _id, status, companyId } = data;
        return Task.findOneAndUpdate({ _id, companyId }, { status }, { new: true });
    }

    async updatePriority(data) {
        const { _id, priority, companyId } = data;
        return Task.findOneAndUpdate({ _id, companyId }, { priority }, { new: true })
    }
    async updateAssigned(data) {
        const { _id, assignedTo, companyId } = data;
        return Task.findOneAndUpdate({ _id, companyId }, { assignedTo }, { new: true })
    }

}
