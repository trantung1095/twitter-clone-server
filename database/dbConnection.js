import mongoose from "mongoose";
import config from 'config'
import logger from '../logging/logger';

let dbConnection

let getDBConnection = async () => {
    try {
        let connectionOptions = {
            user: process.env.MONGODB_USER,
            pass: process.env.MONGODB_PASSWORD,
            dbName: process.env.MONGODB_DB,
            useNewUrlParser: config.get('mongodb_settings.use_new_url_parser'),
            useCreateIndex: config.get('mongodb_settings.use_create_index')
        }

        dbConnection = await mongoose.connect(process.env.MONGODB_URL, connectionOptions, (err) => {
            if (err) {
                logger.error('Could not establish connection to db', {meta: err});
                return;
            }
            logger.info('Mongodb connection was successful')
        })
    } catch (err) {
        logger.error('Error connecting to the db', {meta: err})
    }
}

exports.dbConnection = () => getDBConnection()