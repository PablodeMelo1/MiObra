import mongoose from 'mongoose';
import ProjectMember from '../model/projectMember.mjs';

export default class ProjectMemberRepository {
    async createOne(memberData) {
        const member = new ProjectMember(memberData);
        return await member.save();
    }

    async findByUserId(memberId) {
        return await ProjectMember.findById(memberId);
    }

    async findByProjectId(projectId) {
        return await ProjectMember.find({ projectId });
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

    async updateRol(data) {
        const { _id, rol } = data;
        return Task.findOneAndUpdate({ _id }, { rol })
    }
}
