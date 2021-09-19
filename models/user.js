const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            birthYear: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            birthMonth: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            birthDate: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db) {

    }
}