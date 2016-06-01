var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    "use strict"

    var Room = sequelize.define("room", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        players: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    }, {
        classMethods: {
            validPassword: function (password, dbpassword) {
                return bcrypt.compareSync(password, dbpassword);
            }
        },
        dialect: "postgres",
        freezeTableName: true
    });

    Room.beforeCreate(function (room) {
        if (room.password) {
            room.password = bcrypt.hashSync(room.password,
                                            bcrypt.genSaltSync(8),
                                            null
                                           );
        }
    });

    return Room;
}