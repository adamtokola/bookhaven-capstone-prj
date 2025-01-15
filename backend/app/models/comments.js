module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
      Comment.belongsTo(models.Review, { foreignKey: 'review_id' });
    };
  
    return Comment;
  };
  