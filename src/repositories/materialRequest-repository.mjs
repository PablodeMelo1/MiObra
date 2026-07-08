import MaterialRequest from '../model/materialRequest-schema.mjs';

export default class MaterialRequestRepository {
  async createOne(data) {
    const materialRequest = new MaterialRequest(data);
    return materialRequest.save();
  }

  async getAll(companyId) {
    return MaterialRequest.find({ companyId })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  }

  async getById(data) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findOne({ _id: id, companyId: data?.companyId })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }

  async deleteById(data) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findOneAndDelete({ _id: id, companyId: data?.companyId });
  }

  async updateById(data, updateData = {}) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findOneAndUpdate({ _id: id, companyId: data?.companyId }, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }

  async updateStatus(data) {
    const { _id, status, companyId } = data;
    return MaterialRequest.findOneAndUpdate({ _id, companyId }, { status }, { new: true, runValidators: true })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }
}
