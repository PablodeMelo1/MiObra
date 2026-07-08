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

    async findByUserId(userId, companyId = null) {
        const query = { userId };
        if (companyId) query.companyId = companyId;
        return await ProjectMember.find(query);
    }

    async findByProjectId(projectId, companyId) {
        return await ProjectMember.find({ projectId, companyId });
    }

    async getByProjectId(data) {
        const projectId = typeof data === 'string' ? data : data?.projectId;
        return await ProjectMember.find({ projectId, companyId: data?.companyId });
    }

    async getById(data) {
        const id = typeof data === 'string' ? data : data?._id;
        const query = { _id: id };
        if (data?.companyId) query.companyId = data.companyId;
        return await ProjectMember.findOne(query);
    }

    async getAll(companyId) {
        return ProjectMember.find({ companyId });
    }

    async deleteUserById(memberId, companyId) {
        try {
            return await ProjectMember.findOneAndDelete({ _id: memberId, companyId });
        } catch (err) {
            throw new Error('Error deleting project member: ' + err.message);
        }
    }

    async deleteById(data) {
        const id = typeof data === 'string' ? data : data?._id;
        const query = { _id: id };
        if (data?.companyId) query.companyId = data.companyId;
        return await ProjectMember.findOneAndDelete(query);
    }

    async updateRol(data) {
        const { _id, role, companyId } = data;
        return ProjectMember.findOneAndUpdate({ _id, companyId }, { role }, { new: true });
    }

    async updateById(data, updateData = {}) {
        const id = typeof data === 'string' ? data : data?._id;
        const query = { _id: id };
        if (data?.companyId) query.companyId = data.companyId;
        return await ProjectMember.findOneAndUpdate(query, updateData, { new: true });
    }
}
