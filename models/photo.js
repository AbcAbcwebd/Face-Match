var Sequelize = require('sequelize');

module.exports = function(sequelize, Sequelize) {
 
    var Photo = sequelize.define('photo', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        url: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        faceId: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        matchId: {
            type: Sequelize.STRING,
            notEmpty: true
        }
    });

    Photo.associate = function(models) {
        Photo.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
                defaultValue: 1
            }
        });
    };
 
    return Photo;
 
}