import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const shortUrlSchema = Joi.object({
  longUrl: Joi.string()
    .uri()
    .required()
    .label("Long URL")
    .messages({
      "string.empty": `"Long URL" cannot be empty`,
      "any.required": `"Long URL" is required`,
      "string.uri": `"Long URL" must be a valid URL`
    }),
  customAlias: Joi.string()
    .alphanum()
    .optional()
    .min(3)
    .max(30)
    .label("Custom Alias")
    .messages({
      "string.alphanum": `"Custom Alias" must contain only letters and numbers`,
      "string.min": `"Custom Alias" should have a minimum length of {#limit}`,
      "string.max": `"Custom Alias" should have a maximum length of {#limit}`
    }),
  topic: Joi.string()
    .optional()
    .label("Topic")
});

export const validateShortUrlBody = (req: Request, res: Response, next: NextFunction) => {
  const { error } = shortUrlSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((detail) => detail.message)
    });
  }
  next();
};



const aliasParamSchema = Joi.object({
    alias: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9_-]+$"))
      .min(3)
      .max(30)
      .required()
      .label("Alias")
      .messages({
        "string.empty": `"Alias" cannot be empty`,
        "string.pattern.base": `"Alias" must contain only letters, numbers, underscores, or hyphens`,
        "string.min": `"Alias" should have a minimum length of {#limit}`,
        "string.max": `"Alias" should have a maximum length of {#limit}`,
        "any.required": `"Alias" is required`,
      }),
  });
  
  export const validateAliasParam = (req: Request, res: Response, next: NextFunction) => {
    const { error } = aliasParamSchema.validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Invalid alias parameter",
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };