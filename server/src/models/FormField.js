import { DataTypes } from "sequelize";
import { sequelize } from "../dbs/postgresDb.js";
import Form from "./Form.js";
import Field from "./Field.js";

const FormField = sequelize.define(
  "FormField",
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
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Field,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    meta: {
      type: DataTypes.JSONB,
    },
  },
  {
    indexes: [
      {
        name: "unique_fieldId_formId_index",
        unique: true,
        fields: ["fieldId", "formId"],
      },
    ],
  }
);

Form.hasMany(FormField, { foreignKey: "formId", as: "fields" });
Field.hasMany(FormField, { foreignKey: "fieldId", as: "fields" });
FormField.belongsTo(Form, { foreignKey: "formId", as: "form" });
FormField.belongsTo(Field, { foreignKey: "fieldId", as: "field" });

export default FormField;
