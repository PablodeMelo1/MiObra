import Employee from '../model/employee-schema.mjs';

const populateEmployee = (query) => query
    .populate('userId', 'name email emailVerificationStatus')
    .populate('createdByUserId', 'name email');

export default class EmployeeRepository {
    async createOne(data, session = null) {
        const [employee] = await Employee.create([data], { session });
        return employee;
    }

    async getAllByCompany(companyId) {
        return populateEmployee(Employee.find({ companyId }).sort({ fullName: 1 }));
    }

    async getByIdForCompany(id, companyId) {
        return populateEmployee(Employee.findOne({ _id: id, companyId }));
    }

    async getByUserIdForCompany(userId, companyId) {
        return Employee.findOne({ userId, companyId });
    }

    async getByWorkEmailForCompany(workEmail, companyId) {
        return Employee.findOne({ workEmail, companyId });
    }

    async updateByIdForCompany(id, companyId, data, session = null) {
        return populateEmployee(Employee.findOneAndUpdate(
            { _id: id, companyId },
            data,
            { new: true, runValidators: true, session },
        ));
    }

    async deleteByIdForCompany(id, companyId) {
        return Employee.findOneAndDelete({ _id: id, companyId });
    }

    async linkUser(employeeId, companyId, userId, session = null) {
        return Employee.findOneAndUpdate(
            { _id: employeeId, companyId },
            { userId },
            { new: true, runValidators: true, session },
        );
    }
}
