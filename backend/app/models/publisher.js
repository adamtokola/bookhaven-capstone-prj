module.exports = (sequelize, DataTypes) => {
  const Publisher = sequelize.define('Publisher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100)
    },
    website: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'publishers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Publisher.associate = (models) => {
    Publisher.hasMany(models.Book, {
      foreignKey: 'publisher_id',
      as: 'books'
    });
  };

  return Publisher;
}; 