import { DataTypes } from "sequelize";
import { sequelize } from "../dbs/postgresDb.js";
import Form from "./Form.js";

const FormSubmit = sequelize.define(
  "FormSubmit",
  {
    formId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Form,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    submittedData: {
      type: DataTypes.JSONB,
    },
  },
  {
    indexes: [
      {
        name: "unique_email_formId_index",
        unique: true,
        fields: ["email", "formId"],
      },
    ],
  }
);

Form.hasMany(FormSubmit, { foreignKey: "formId", as: "submits" });
FormSubmit.belongsTo(Form, { foreignKey: "formId", as: "form" });

export default FormSubmit;
