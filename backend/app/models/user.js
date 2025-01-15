
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
    });

    User.associate = (models) => {
        User.hasMany(models.Review, { foreignKey: "userId" });
        User.hasMany(models.Comment, { foreignKey: "userId" });
    };

    return User;
};
