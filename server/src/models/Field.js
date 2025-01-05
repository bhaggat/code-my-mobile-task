import { DataTypes } from "sequelize";
import { sequelize } from "../dbs/postgresDb.js";
import User from "./User.js";

const Field = sequelize.define(
  "Field",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [2, 100] },
    },
    fieldType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    meta: {
      type: DataTypes.JSONB,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    indexes: [
      {
        name: "unique_name_userId_index",
        unique: true,
        fields: ["name", "userId"],
      },
    ],
  }
);

User.hasMany(Field, { foreignKey: "userId", as: "fields" });
Field.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Field;
