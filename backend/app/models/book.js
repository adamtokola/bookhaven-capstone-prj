module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    publication_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    page_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'books',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: 'author_id',
      as: 'author'
    });
    Book.belongsTo(models.Publisher, {
      foreignKey: 'publisher_id',
      as: 'publisher'
    });
    Book.belongsToMany(models.Genre, {
      through: 'book_genres',
      foreignKey: 'book_id',
      otherKey: 'genre_id',
      as: 'genres'
    });
    Book.hasMany(models.Review, {
      foreignKey: 'book_id',
      as: 'reviews'
    });
  };

  return Book;
};
 