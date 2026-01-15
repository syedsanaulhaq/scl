import Joi from 'joi';

/**
 * Request Validation Middleware Factory
 * Creates middleware to validate request data against a schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      { body: req.body, query: req.query, params: req.params },
      { abortEarly: false, convert: true }
    );

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    req.validated = value;
    next();
  };
};

/**
 * Common Validation Schemas
 */
export const validationSchemas = {
  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),

  register: Joi.object({
    body: Joi.object({
      firstName: Joi.string().max(100).required(),
      lastName: Joi.string().max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      instituteId: Joi.number().required(),
    }),
  }),

  updateProfile: Joi.object({
    body: Joi.object({
      firstName: Joi.string().max(100),
      lastName: Joi.string().max(100),
      phone: Joi.string().max(20),
      address: Joi.string().max(500),
    }),
  }),

  refreshToken: Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  }),

  pagination: Joi.object({
    query: Joi.object({
      page: Joi.number().default(1).min(1),
      limit: Joi.number().default(10).min(1).max(100),
      search: Joi.string().allow(''),
      sort: Joi.string().allow(''),
    }),
  }),
};
