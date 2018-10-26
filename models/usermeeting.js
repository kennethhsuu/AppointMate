const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/lsapp');
const User = require('../models/user');
const Meeting = require('../models/meeting');

const UserMeeting = sequelize.define('usermeeting', {
    uId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        unique: false,
        references: {
            model: User,
            key: 'uId'
        }
      },
    mId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: Meeting,
            key: 'mId'
        }
    }
});

sequelize.sync().then(() => console.log('[[usermeet table has been successfully created, if one doesn\'t exist]]'))
.catch(error => console.log('usermeet error occured', error));;

module.exports = UserMeeting;