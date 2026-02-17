import mongoose from "mongoose";
import { baseConstant } from "../constants/base-constant.mjs";
import "dotenv/config"

const { MONGO_URL, MONGO_PORT, MONGO_DB, MONGO_BD_IN_USE, MONGO_LOCAL, MONGO_ATLAS, MONGO_ATLAS_URI } = process.env;
let MONGO_URI;


if (MONGO_BD_IN_USE == baseConstant.MONGO) {
    MONGO_URI = `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`;
} else {
    MONGO_URI = MONGO_ATLAS_URI;
}

export const connectMongo = async () => {
    try {
        mongoose.connect(MONGO_URI, {})
        console.log('Levanto Mongo')
    } catch (err) {
        console.log('Hubo un error en la conexion de mongo', err);
        process.exit(1);
    }
}


connectMongo();




