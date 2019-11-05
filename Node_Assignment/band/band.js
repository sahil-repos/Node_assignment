  module.exports = (sequelize, type) => {
    return sequelize.define('bands', {
         id: {

           type: type.INTEGER,
           primaryKey: true,
           autoIncrement: true
         },
        
         bandname: {

             type: type.STRING,
             defaultValue: null
        }
        
    }
    )
}