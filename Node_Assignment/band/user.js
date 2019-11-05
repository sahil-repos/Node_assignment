    module.exports = (sequelize, type) => {
     return sequelize.define('users', {
         user_id: {
           type: type.INTEGER,
          primaryKey: true,
           autoIncrement: true
                    },
          username: {
              type: type.STRING,
                defaultValue: null
                    },
        
         user_email: {
             type: type.STRING,
             defaultValue: null
                     },
         user_password:{
              type: type.STRING,
              dafaultValue: null
                       },
            user_dob:{
             type: type.STRING,
             defaultValue: null
                     },
      
        company: {
            type: type.STRING,
            dafaultValue: null
                 },
         user_otp:{
             type: type.STRING,
             defaultValue: null
                  },
         otplife: {
              type: type.DOUBLE,
              defaultValue: 0
                  }
    }
    )
}