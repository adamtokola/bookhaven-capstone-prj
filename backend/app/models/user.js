module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password_hash: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    }
  }, {
    underscored: true,
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.Review, { foreignKey: "user_id" });
    User.hasMany(models.Comment, { foreignKey: "user_id" });
  };

  return User;
};
 