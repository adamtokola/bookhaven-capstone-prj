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
      allowNull: false,
      references: {
        model: 'authors',
        key: 'id'
      }
    },
    publication_year: {
      type: DataTypes.INTEGER
    },
    isbn: {
      type: DataTypes.STRING(13)
    },
    language: {
      type: DataTypes.STRING(50),
      defaultValue: 'English'
    },
    page_count: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT
    },
    cover_image_url: {
      type: DataTypes.TEXT
    },
    rating: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: false
    }
  }, {
    tableName: 'books',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Book.associate = function(models) {
    if (!models.Author) {
      console.error('Author model not found!');
      return;
    }
    Book.belongsTo(models.Author, {
      foreignKey: 'author_id',
      as: 'author'
    });
  };

  return Book;
};
 