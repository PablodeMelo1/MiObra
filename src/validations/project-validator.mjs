import Joi from 'joi';

export const validateCreateProject = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string(),
  location: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  //status:
});