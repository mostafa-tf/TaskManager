const Joi = require("joi");

function validatelogin(reqbody) {
  const schema = Joi.object({
    email: Joi.string().email().min(11).max(25).required(),
    password: Joi.string().min(5).max(12).required(),
  });
  return schema.validate(reqbody);
}
function validatesignup(reqbody) {
  const schema = Joi.object({
    email: Joi.string().email().min(11).max(35).required(),
    password: Joi.string().min(5).max(15).required(),
    username: Joi.string().required().min(2).max(20),
  });
  return schema.validate(reqbody);
}
function validatenewtask(reqbody) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(15),
    dueDate: Joi.string().required(),
    priority: Joi.string().valid("", "low", "medium", "high"),
    description: Joi.string().max(80).allow(""),
  });
  return schema.validate(reqbody);
}
function validateupdateprofile(reqbody) {
  const schema = Joi.object({
    email: Joi.string().email().min(11).max(35).required(),
    username: Joi.string().required().min(2).max(20),
  });
  return schema.validate(reqbody);
}
module.exports = {
  validatelogin,
  validatesignup,
  validatenewtask,
  validateupdateprofile,
};
