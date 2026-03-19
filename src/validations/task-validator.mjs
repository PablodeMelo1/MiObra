import Joi from 'joi';
import { TASK_STATUS } from '../constants/taskStatus.mjs';
import { TASK_PRIORITY } from '../constants/taskPriopity.mjs';

export const validateCreateTask = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    status: Joi.string().valid(...Object.values(TASK_STATUS)),
    priority: Joi.string().valid(...Object.values(TASK_PRIORITY)),
    createdDate: Joi.date(),
    dueDate: Joi.date(),
});

