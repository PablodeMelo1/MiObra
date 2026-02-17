import joi from 'joi';

export const validateCreateProject = joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string(),
  location: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  //status:
});