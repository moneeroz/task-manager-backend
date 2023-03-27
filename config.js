// Database Conniction Info
const Sequelize = require('sequelize')
const config = new Sequelize('taskmanager', 'root', '', { dialect: 'mariadb' })

module.exports = config
