import { Directories, Files } from "../../../directories.js";
import { resolve } from "path";
import fs from "fs";

export default async function imp(){
    let arr = [];
    (function find(path, fnc){
        for(const file of fs.readdirSync(path)){
            if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
            else if(file.endsWith(Files.extname.import))arr.push(import("file://" + resolve(path, file)));
        }
    })(Directories.import);
    await Promise.all(arr);
}