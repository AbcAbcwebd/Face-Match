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
 
        date_added: {
            type: Sequelize.DATE
        },
 
 
    });

    Photo.associate = function(models) {
        Photo.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
 
    return Photo;
 
}