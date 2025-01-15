
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    genre: { type: DataTypes.STRING, allowNull: false },
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
  });

  Book.associate = (models) => {
    Book.hasMany(models.Review, { foreignKey: "bookId" });
  };

  return Book;
};
