import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  APP_URL: Joi.string().required().description('Front-end App URL required.'),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  DATABASE_URI: Joi.string().required().description('Mongo DB host url'),
})
  .unknown()
  .required();
