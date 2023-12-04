const createError = require('http-errors');
const errorCodes = require("../helpers/enums/errorCodes.enum");
const validators = require('../helpers/validators/app.validator');


module.exports = (validatorType, method) => {
  const validator = getValidator(validatorType, method);
  if (typeof validator === "undefined")
    throw new Error(`'${validator}' validator does not exist`);

  return async (req, res, next) => {
    try {
      req.body = await validator.validateAsync(req.body);
      next()
    } catch (err) {
      if (err.isJoi) {
        const response = {
          status: errorCodes.Error400.code, type: errorCodes.Error400.type,
          message: `Required field missing: ${err.details[0].message}..`
        };
        return res.status(response.status).json({status: response.type, message: response.message});
      }
      next(createError(500));
    }
  }
};

const getValidator = (validatorType, method) => {
  if (validatorType === "validator") return validators[method];
}

