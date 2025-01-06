import { Op } from "sequelize";
import Form from "../models/Form.js";
import Field from "../models/Field.js";
import FormSubmit from "../models/FormSubmit.js";

export const createForm = async (req, res, next) => {
  try {
    const existingForm = await Form.findOne({
      where: {
        userId: req.userId,
        title: req.body.title,
      },
    });
    if (existingForm) {
      return res.status(409).json({
        success: false,
        message: "Form already exists with the same title!",
      });
    }

    if (req.body.fields.length > 0) {
      const fieldCount = await Field.count({
        where: {
          id: { [Op.in]: req.body.fields },
          userId: req.userId,
        },
      });
      if (fieldCount !== req.body.fields.length) {
        return res.status(400).json({
          success: false,
          message: "One or more fields are invalid.",
        });
      }
    }

    const form = await Form.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: form });
  } catch (err) {
    console.error("Error creating form:", err);
    next(err);
  }
};

export const getForms = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const query = {
      userId: req.userId,
      ...(search ? { title: { [Op.like]: `%${search}%` } } : {}),
    };

    const forms = await Form.findAndCountAll({
      where: query,
      order: [["createdAt", "DESC"]],
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
    });

    res.status(200).json({
      success: true,
      data: forms.rows,
      pagination: {
        total: forms.count,
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (err) {
    console.error("Error fetching forms:", err);
    next(err);
  }
};

export const getForm = async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id, {
      where: { userId: req.userId },
      include: [
        {
          model: FormSubmit,
          as: "submits",
        },
      ],
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    const fieldIds = form.fields || [];
    if (fieldIds.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: { ...form.toJSON(), fields: [] } });
    }

    const fields = await Field.findAll({
      where: { id: { [Op.in]: fieldIds } },
      attributes: ["id", "name", "fieldType"],
    });

    const formWithFields = {
      ...form.toJSON(),
      fields,
    };

    res.status(200).json({
      success: true,
      data: {
        form: formWithFields,
        formSubmits: form.submits,
      },
    });
  } catch (err) {
    console.error("Error fetching form:", err);
    next(err);
  }
};

export const getFormByPublicId = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      where: { publicId: req.params.publicId, published: true },
      attributes: ["id", "title", "fields", "description"],
    });

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    const fieldIds = form.fields || [];
    if (fieldIds.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: { ...form.toJSON(), fields: [] } });
    }

    const fields = await Field.findAll({
      where: { id: { [Op.in]: fieldIds } },
      attributes: ["id", "name", "fieldType"],
    });

    const formWithFields = {
      ...form.toJSON(),
      fields,
    };

    res.status(200).json({ success: true, data: formWithFields });
  } catch (err) {
    console.error("Error fetching form:", err);
    next(err);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const existingForm = await Form.findOne({
      where: {
        userId: req.userId,
        title: req.body.title,
        id: { [Op.ne]: req.params.id },
      },
    });
    if (existingForm) {
      return res.status(409).json({
        success: false,
        message: "Form already exists with the same title!",
      });
    }

    const form = await Form.findByPk(req.params.id, {
      where: { userId: req.userId },
    });
    if (req.body.fields.length > 0) {
      const invalidFields = await Field.findAll({
        where: {
          id: { [Op.in]: req.body.fields },
          userId: req.userId,
        },
      });
      if (invalidFields.length !== req.body.fields.length) {
        return res.status(400).json({
          success: false,
          message: "One or more fields are invalid.",
        });
      }
    }

    await form.update(req.body);
    res.status(200).json({ success: true, data: form });
  } catch (err) {
    console.error("Error updating form:", err);
    next(err);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findByPk(req.params.id, {
      where: { userId: req.userId },
    });
    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    await form.destroy();
    res
      .status(200)
      .json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    console.error("Error deleting form:", err);
    next(err);
  }
};
