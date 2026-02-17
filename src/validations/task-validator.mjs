import Joi from 'joi';
import { PROJECT_STATUS } from '../constants/projectStatus.mjs';
import { PROJECT_PRIORITY } from '../constants/projectPriopity.mjs';

export const valdiateCreateTask = joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    status: Joi.string().valid(PROJECT_STATUS),
    priority: Joi.string().valid(PROJECT_PRIORITY),
    createdDate: Joi.date(),
    dueDate: Joi.date(),
});

