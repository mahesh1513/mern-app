const mongoose = require('mongoose')
require('dotenv').config();
class DB {

    constructor() {

        if(!DB.instance) {

            this.uri = process.env.MONGO_URI || 'mongodb://localhost:27010/express-api';
            this.connect();
            DB.instance = this;

        }
        return DB.instance;
    }

    connect() {

        try {

            mongoose.connect(this.uri)
            console.log("DB connected")
               
           } catch (error) {
               console.log("DB not connected")
           }

    }

    getConnection() {
        return mongoose.connection;
    }

}
const dbconnect = new DB();
Object.freeze(dbconnect)
module.exports = {dbconnect}
