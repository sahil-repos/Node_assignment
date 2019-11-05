//Sequelize ORM with MySQL to create db and relation for user and band

 const Sequelize = require('sequelize')
 const bmodel = require('./band.js');
 const umodel = require('./user.js');
 const sequelize = new Sequelize('dbnode', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,min: 0,acquire: 30000,idle: 10000
    }
}
)

 const User = umodel(sequelize, Sequelize)
 const Band = bmodel(sequelize, Sequelize)

    User.hasMany(Band)

    sequelize.sync({ force: true })
        .then(() => {
         console.log(`Database  created!`)
     }
     )

  module.exports = {User,Band};