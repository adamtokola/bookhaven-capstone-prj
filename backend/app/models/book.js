module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    author: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    genre: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    averageRating: { 
      type: DataTypes.FLOAT, 
      defaultValue: 0,
      field: 'average_rating'
    }
  }, {
    underscored: true,
    timestamps: true,
    tableName: 'books'
  });

  Book.associate = (models) => {
    Book.hasMany(models.Review, {
      foreignKey: "book_id",
      as: "reviews"
    });
  };

  return Book;
};
 