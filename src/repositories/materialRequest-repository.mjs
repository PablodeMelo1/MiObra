import MaterialRequest from '../model/materialRequest-schema.mjs';

export default class MaterialRequestRepository {
  async createOne(data) {
    const materialRequest = new MaterialRequest(data);
    return materialRequest.save();
  }

  async getAll() {
    return MaterialRequest.find()
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  }

  async getById(data) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findById(id)
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }

  async deleteById(data) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findByIdAndDelete(id);
  }

  async updateById(data, updateData = {}) {
    const id = typeof data === 'string' ? data : data?._id;
    return MaterialRequest.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }

  async updateStatus(data) {
    const { _id, status } = data;
    return MaterialRequest.findByIdAndUpdate(_id, { status }, { new: true, runValidators: true })
      .populate('supplierId', 'name contactEmail')
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
  }
}
