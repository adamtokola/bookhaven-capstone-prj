
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: { type: DataTypes.TEXT, allowNull: false },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Review, { foreignKey: "reviewId" });
    Comment.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Comment;
};
