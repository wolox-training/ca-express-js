'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      underscored: true
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
