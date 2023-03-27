const Sequelize = require('sequelize')
const config = require('./../config')

const Task = config.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  catagory: {
    type: Sequelize.STRING,
    allowNull: false
  },
  task_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  priority_level: {
    type: Sequelize.STRING,
    allowNull: false
  },
  progress_level: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, { timestamps: false }) // timestamps: false --so our table doesnt populate the two created at columns

module.exports = Task
