const dotev = require('dotenv')
const connectToDatabase = require('./conection/connection')
dotev.config();
connectToDatabase();
require("./src/express")