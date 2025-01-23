module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    commentText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'comment_text'
    }
  }, {
    underscored: true,
    tableName: 'comments'
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false
      },
      as: 'user'
    });
    Comment.belongsTo(models.Review, {
      foreignKey: {
        name: 'reviewId',
        field: 'review_id',
        allowNull: false
      },
      as: 'review'
    });
  };

  return Comment;
}; 