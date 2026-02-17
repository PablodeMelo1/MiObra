import Task from '../model/task.mjs'

export default class taskMongoRepository {

    async createOne(data) {
        try {
            const newTask = new Task(data);
            const task = await newTask.save();
            console.log('Task created:', task);
        } catch (error) {
            throw new Error('error creating a tast');
        }
    }

    async getAll() {
        return await Task.find();
    }

    async getAllByProjectId(projectId) {
        return await Task.find({ projectId });
    }

    async getAllTasksByProject(projectId) {
        return await Task.find({ project: projectId });
    }

    async getByUserAndProject(data) {
        const { userId, project } = data;
        return await Task.find({ assignedTo: userId, project });
    }

    async getById(data) {
        return Task.findOne(data);
    }

    async getByIdAndProject(data) {
        const { _id, project } = data;
        return Task.findOne({ _id, project });
    }

    async deleteById(data) {
        try {
            const { _id } = data;
            if (!_id) {
                throw new Error("Error al obtener el id")
            }
            const task = await Task.findById(_id);
            if (!task) {
                throw new Error("Task with this id not found");
            }
            await Task.deleteOne({ _id });
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
        const { _id, projectId, ...updateData } = data;
        return Task.findOneAndUpdate({ _id, projectId }, updateData, { new: true });
    }

    async getTasksByList(data) {
        const { projectId, list } = data;
        return Task.find({ projectId, list });
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
        const { _id, status } = data;
        return Task.findOneAndUpdate({ _id }, { status }, { new: true });
    }

    async updatePriority(data) {
        const { _id, priority } = data;
        return Task.findOneAndUpdate({ _id }, { priority }, { new: true })
    }
    async updateAssigned(data) {
        const { _id, assignedTo } = data;
        return Task.findOneAndUpdate({ _id }, { assignedTo }, { new: true })
    }

}