import Pending from '../model/pending-schema.mjs';
import { PENDING_POPULATE } from '../constants/pending-constants.mjs';

export default class PendingRepository {
  async createOne(data) {
    const pending = new Pending(data);
    const saved = await pending.save();
    return Pending.findById(saved._id).populate(PENDING_POPULATE);
  }

  async getAllByUser(userId, companyId) {
    return Pending.find({ collaborators: userId, companyId })
      .populate(PENDING_POPULATE)
      .sort({ createdAt: -1 });
  }

  async getByIdForUser(id, userId, companyId) {
    return Pending.findOne({ _id: id, collaborators: userId, companyId }).populate(PENDING_POPULATE);
  }

  async updateByIdForUser(id, userId, companyId, updateData = {}) {
    return Pending.findOneAndUpdate(
      { _id: id, collaborators: userId, companyId },
      updateData,
      { new: true, runValidators: true },
    ).populate(PENDING_POPULATE);
  }

  async deleteByIdForUser(id, userId, companyId) {
    return Pending.findOneAndDelete({ _id: id, collaborators: userId, companyId });
  }
}
