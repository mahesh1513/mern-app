const mongoose = require('mongoose')
const userSchema =  mongoose.Schema({
    name : {
        type:String,required:true,unique: true
    },
    email : {
        type:String,required:true,unique: true
    },
    password : {
        type:String,required:true
    },
    phonenumber : {
        type:String,required:false
    },
    address : {
        type:String,required:false
    }
})

userSchema.pre('save',async function(next) {

    console.log(this.password)

})

const userModel = mongoose.model('User',userSchema)
module.exports = userModel