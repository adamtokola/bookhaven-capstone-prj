module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    biography: {
      type: DataTypes.TEXT
    },
    birth_year: {
      type: DataTypes.INTEGER
    },
    nationality: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'authors',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Author.associate = (models) => {
    Author.hasMany(models.Book, {
      foreignKey: 'author_id',
      as: 'books'
    });
  };

  return Author;
}; 