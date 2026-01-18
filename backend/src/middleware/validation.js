import Joi from 'joi';

/**
 * Request Validation Middleware Factory
 * Creates middleware to validate request data against a schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    // Build validation data based on schema keys
    const validationData = {};

    // Only include body, query, params if they're required by the schema
    if (schema.describe().keys.body) {
      validationData.body = req.body;
    }
    if (schema.describe().keys.query) {
      validationData.query = req.query;
    }
    if (schema.describe().keys.params) {
      validationData.params = req.params;
    }

    const { error, value } = schema.validate(validationData, {
      abortEarly: false,
      convert: true,
    });

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
      email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
      password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
      }),
    }),
  }),

  register: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 100 characters',
        'any.required': 'Name is required',
      }),
      email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
      password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
      }),
      role: Joi.string().valid('student', 'teacher', 'admin').default('student'),
    }),
  }),

  updateProfile: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 100 characters',
      }),
    }).required(),
  }),

  refreshToken: Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required().messages({
        'any.required': 'Refresh token is required',
      }),
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

  createUser: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('student', 'teacher', 'admin', 'faculty').default('student'),
      instituteId: Joi.number().integer(),
    }),
  }),

  updateUser: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100),
      role: Joi.string().valid('student', 'teacher', 'admin', 'faculty'),
      status: Joi.string().valid('active', 'inactive', 'suspended'),
      instituteId: Joi.number().integer(),
    }),
  }),
};

export const validateUserCreation = validate(validationSchemas.createUser);
export const validateUserUpdate = validate(validationSchemas.updateUser);
