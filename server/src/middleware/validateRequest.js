import { validationResult } from 'express-validator';

export const validateRequest = (request, response, next) => {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    next();
    return;
  }

  response.status(422).json({
    success: false,
    message: 'Validation failed.',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};
