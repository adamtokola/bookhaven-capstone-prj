module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'genres',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Genre.associate = (models) => {
    Genre.belongsToMany(models.Book, {
      through: 'book_genres',
      foreignKey: 'genre_id',
      otherKey: 'book_id',
      as: 'books'
    });
  };

  return Genre;
}; 