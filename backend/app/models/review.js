module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'review_text'
    }
  }, {
    underscored: true,
    tableName: 'reviews'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { 
      foreignKey: {
        name: 'userId',
        field: 'user_id',
        allowNull: false
      },
      as: "user"
    });
    Review.belongsTo(models.Book, { 
      foreignKey: {
        name: 'bookId',
        field: 'book_id',
        allowNull: false
      },
      as: "book"
    });
    Review.hasMany(models.Comment, { 
      foreignKey: {
        name: 'reviewId',
        field: 'review_id'
      },
      as: "comments"
    });
  };

  return Review;
};
 