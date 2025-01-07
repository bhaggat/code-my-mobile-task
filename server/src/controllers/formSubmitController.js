import { removeUploadedFiles } from "../middlewares/fileUploader.js";
import Form from "../models/Form.js";
import FormSubmit from "../models/FormSubmit.js";

export const getFormSubmits = async (req, res, next) => {
  try {
    const formSubmits = await FormSubmit.findAll({
      where: { userId: req.userId },
    });
    res.status(200).json({ success: true, data: formSubmits });
  } catch (err) {
    next(err);
  }
};

export const getFormSubmit = async (req, res, next) => {
  try {
    const formSubmit = await FormSubmit.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!formSubmit) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: formSubmit });
  } catch (err) {
    next(err);
  }
};

export async function validateRequest(req, res, next) {
  try {
    const { formId, email, submittedData, allFileIds } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      removeUploadedFiles(req.uploadedFileIds);
      return res.status(422).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!formId || !email || !submittedData) {
      removeUploadedFiles(req.uploadedFileIds);
      return res.status(422).json({
        success: false,
        message:
          "The following fields are required: formId, email, and submittedData.",
      });
    }

    try {
      req.body.submittedData = JSON.parse(submittedData);
      req.body.allFileIds = allFileIds ? JSON.parse(allFileIds) : [];
    } catch (error) {
      removeUploadedFiles(req.uploadedFileIds);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in submittedData or allFileIds",
      });
    }

    const form = await Form.findOne({
      where: { id: formId, published: true },
      attributes: ["id"],
    });

    if (!form) {
      removeUploadedFiles(req.uploadedFileIds);
      return res.status(404).json({
        success: false,
        message: "Form does not exist or is unpublished by author.",
      });
    }

    const formExists = await FormSubmit.findOne({
      where: { formId, email },
      attributes: ["id"],
    });

    if (formExists) {
      removeUploadedFiles(req.uploadedFileIds);
      return res.status(409).json({
        success: false,
        message: `This form has already been submitted by ${email}.`,
      });
    }

    if (req.body.allFileIds) {
      req.body.allFileIds.forEach((id, index) => {
        req.body.submittedData[`${id}`] = req.uploadedFileIds[index];
      });
    }
    delete req.body.allFileIds;
    next();
  } catch (err) {
    removeUploadedFiles(req.uploadedFileIds);
    next(err);
  }
}

export const createFormSubmit = async (req, res, next) => {
  const transaction = await FormSubmit.sequelize.transaction();

  try {
    const formSubmit = await FormSubmit.create(req.body, { transaction });
    await transaction.commit();

    res.status(201).json({ success: true, data: formSubmit });
  } catch (err) {
    await transaction.rollback();
    removeUploadedFiles(req.uploadedFileIds);
    next(new Error("Failed to create form submission: " + err.message));
  }
};
