import dotenv from "dotenv";
import fs from "fs";
import {resolve} from "path";

if(fs.existsSync(resolve(process.cwd(), ".env.local")))dotenv.config({path: resolve(process.cwd(), ".env.local")});
dotenv.config();

const env = process.env;

export default env;
