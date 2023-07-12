const Joi = require('joi');
const {Types} = require('mongoose');

const authValidator = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .max(20)
        .optional(),
    role: Joi.string()
        .optional(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (e) {
    next(e);
  }
};

const truckTypeValidator = async (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string()
        .required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (e) {
    next(e);
  }
};

const checkMongodbId = async (req, res, next) => {
  try {
    const mongodbId = req.params.id;
    const checkId = Types.ObjectId.isValid(mongodbId);

    if (!checkId) {
      return await res.status(400).json({
        message: `Invalid mongodb id!`,
      });
    }
    next();
  } catch (e) {
    next(e);
  }
};

const loadValidator = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
        .required(),
    payload: Joi.number()
        .required(),
    pickup_address: Joi.string()
        .required(),
    delivery_address: Joi.string()
        .required(),
    dimensions: Joi.object({
      width: Joi.number(),
      length: Joi.number(),
      height: Joi.number(),
    }).required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authValidator,
  truckTypeValidator,
  checkMongodbId,
  loadValidator,
};
