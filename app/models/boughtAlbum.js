'use strict';

module.exports = (sequelize, DataTypes) => {
  const BoughtAlbum = sequelize.define(
    'boughtalbum',
    {
      albumId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, field: 'album_id' }
    },
    {
      underscored: true
    }
  );
  BoughtAlbum.associate = function(models) {
    BoughtAlbum.belongsTo(models.user);
  };
  return BoughtAlbum;
};
