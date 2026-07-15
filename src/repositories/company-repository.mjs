import Company from '../model/company-schema.mjs';

export default class CompanyRepository {
    async createOne(data, session = null) {
        if (session) {
            const [company] = await Company.create([data], { session });
            return company;
        }
        const company = new Company(data);
        return company.save();
    }

    async getById(id) {
        return Company.findById(id);
    }

    async updateById(id, data) {
        return Company.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async lockForMembershipUpdate(id, session) {
        return Company.findOneAndUpdate(
            { _id: id },
            { $inc: { membershipRevision: 1 } },
            { new: true, session },
        );
    }
}
