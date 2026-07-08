import dotenv from 'dotenv';
dotenv.config();

import { connectMongo } from '../src/config/mongo-config.mjs';
import Company from '../src/model/company-schema.mjs';
import CompanyMember from '../src/model/companyMember-schema.mjs';
import User from '../src/model/user-schema.mjs';
import Project from '../src/model/project-schema.mjs';
import ProjectMember from '../src/model/projectMember-schema.mjs';
import Task from '../src/model/task-schema.mjs';
import Comment from '../src/model/comment-schema.mjs';
import Item from '../src/model/item-schema.mjs';
import ItemActivity from '../src/model/itemActivity-schema.mjs';
import InventoryMovement from '../src/model/inventoryMovement-schema.mjs';
import MaterialRequest from '../src/model/materialRequest-schema.mjs';
import Supplier from '../src/model/supplier-schema.mjs';
import Pending from '../src/model/pending-schema.mjs';
import Group from '../src/model/group-schema.mjs';
import Zone from '../src/model/zones-schemas.mjs';
import { COMPANY_ROLES } from '../src/constants/companyRoles.mjs';
import { userRoles } from '../src/constants/userRole.mjs';

const DEFAULT_COMPANY_NAME = process.env.DEFAULT_COMPANY_NAME || 'Empresa default MiObra';

const operationalModels = [
    Project,
    ProjectMember,
    Task,
    Comment,
    Item,
    ItemActivity,
    InventoryMovement,
    MaterialRequest,
    Supplier,
    Pending,
    Group,
    Zone,
];

const run = async () => {
    await connectMongo();

    const owner = await User.findOne({ tipoUsuario: userRoles.ADMIN }).sort({ createdAt: 1 })
        || await User.findOne({}).sort({ createdAt: 1 });

    if (!owner) {
        throw new Error('No hay usuarios existentes para crear la empresa default');
    }

    let company = await Company.findOne({ name: DEFAULT_COMPANY_NAME });
    if (!company) {
        company = await Company.create({
            name: DEFAULT_COMPANY_NAME,
            status: 'active',
            plan: 'starter',
            billingStatus: 'active',
            createdByUserId: owner._id,
        });
    }

    const users = await User.find({});
    for (const user of users) {
        await CompanyMember.updateOne(
            { companyId: company._id, userId: user._id },
            {
                $setOnInsert: {
                    companyId: company._id,
                    userId: user._id,
                    role: String(user._id) === String(owner._id) ? COMPANY_ROLES.OWNER : COMPANY_ROLES.OPERATOR,
                    status: 'active',
                    joinedAt: new Date(),
                },
            },
            { upsert: true },
        );
    }

    for (const Model of operationalModels) {
        await Model.updateMany(
            { companyId: { $exists: false } },
            { $set: { companyId: company._id } },
        );
    }

    console.log(`Migracion completada. companyId default: ${company._id}`);
    process.exit(0);
};

run().catch((error) => {
    console.error('Error en migracion default company:', error);
    process.exit(1);
});
