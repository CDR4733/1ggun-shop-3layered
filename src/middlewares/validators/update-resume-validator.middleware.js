import Joi from "joi";
import { MESSAGES } from "../../constants/message.constant.js";
import { MIN_RESUME_LENGTH } from "../../constants/resume.constant.js";

const schema = Joi.object({
  resumeTitle: Joi.string(),
  resumeContent: Joi.string().min(MIN_RESUME_LENGTH).messages({
    "string.min": MESSAGES.RESUMES.COMMON.CONTENT.MIN_LENGTH,
  }),
})
  .min(1)
  .messages({
    "object.min": MESSAGES.RESUMES.UPDATE.NO_BODY_DATA,
  });
// resumeTitle, resumeContent 중 최소 1개는 있어야한다는 뜻!

export const updateResumeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
