import mongoose from 'mongoose';
import ProjectMember from '../model/projectMember-schema.mjs';

export default class ProjectMemberRepository {

    // Create a project member. Sessions/transactions are not used by default.
    async createOne(memberData) {
        try {
            const member = new ProjectMember(memberData);
            return await member.save();
        } catch (err) {
            throw err;
        }
    }

    async findByUserId(userId) {
        return await ProjectMember.find({ userId });
    }

    async findByProjectId(projectId) {
        return await ProjectMember.find({ projectId });
    }

    async getByProjectId(data) {
        const projectId = typeof data === 'string' ? data : data?.projectId;
        return await ProjectMember.find({ projectId });
    }

    async getById(data) {
        const id = typeof data === 'string' ? data : data?._id;
        return await ProjectMember.findById(id);
    }

    async getAll() {
        
        return ProjectMember.find({});
    }

    async deleteUserById(memberId) {
        try {
            await ProjectMember.findByIdAndDelete(memberId);
        } catch (err) {
            throw new Error('Error deleting project member: ' + err.message);
        }
    }

    async deleteById(data) {
        const id = typeof data === 'string' ? data : data?._id;
        return await ProjectMember.findByIdAndDelete(id);
    }

    async updateRol(data) {
        const { _id, role } = data;
        return ProjectMember.findOneAndUpdate({ _id }, { role }, { new: true });
    }

    async updateById(data, updateData = {}) {
        const id = typeof data === 'string' ? data : data?._id;
        return await ProjectMember.findByIdAndUpdate(id, updateData, { new: true });
    }
}
