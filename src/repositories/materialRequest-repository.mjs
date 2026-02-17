
import MaterialRequest from "../model/materialRequest.mjs";

export default class materialRequestMongoRepository {
    async createOne(data) {
        try {
            const matReq = new MaterialRequest(data);
            const newMatReq = await matReq.save();
            return newMatReq;
        } catch (error) {
            throw new Error("Error creating a material request: ", error.message);
        }
    }

    async getAll() {
        return MaterialRequest.find();
    }

    async getById(data) {
        return MaterialRequest.findOne(data);
    }

    async deleteByID(data) {
        try {
            const { _id } = data;
            const matReq = MaterialRequest.findByID({ _id });
            if (!matReq) throw new Error(`Material request con id ${_id} no encontrado`);
            await MaterialRequest.findByIdAndDelete({ _id });
        } catch (error) {
            throw new Error("Error deleting by ID: ", error.message);
        }
    }

    async updateMaterialRequest(data){
        try {
            const {_id, ...matReq} = data;
            const matRequest = MaterialRequest.findByID(_id);
            if(!matReq) throw new Error(`Material request con id ${_id} no encontrado`);
            return await MaterialRequest.findByIdAndUpdate({_id}, {matReq}, {new: true});
        } catch (error) {
            throw new Error("Error updating by ID: ", error.message);
        }
    }

    async updateStatus(data) {
        const { _id, status } = data;
        return MaterialRequest.findOneAndUpdate({ _id }, { status });
    }

    async updatePriority(data) {
        const { _id, prio } = data;
        return MaterialRequest.findOneAndUpdate({ _id }, { prio })
    }
    async updateAssigned(data) {
        const { _id, assig } = data;
        return MaterialRequest.findOneAndUpdate({ _id }, { assig })
    }
}