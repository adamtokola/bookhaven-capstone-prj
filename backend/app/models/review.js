
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("Review", {
        rating: { type: DataTypes.INTEGER, allowNull: false },
        comment: { type: DataTypes.TEXT, allowNull: false },
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Book, { foreignKey: "bookId" });
        Review.belongsTo(models.User, { foreignKey: "userId" });
    };

    return Review;
};
