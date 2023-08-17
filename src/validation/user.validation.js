const joi = require("joi");

exports.userValidation = (req, res, next) => {
  const valdateUser = (data) => {
    const schema = joi.object({
      username: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      role: joi.number().required(),
    });
    return schema.validate(data);
  };
  const { error } = valdateUser(req.body);
  if (error) {
    return res.json({
      message: error.message,
      status_code: 400,
    });
  }
  next();
};
