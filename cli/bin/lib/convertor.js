import { Directories, Files } from "../../directories.js";

export default function convertor(path, type){
    return path.replace(Directories[type] + "/", "").split(Files.extname[type]).slice(0, -1).join(Files.extname[type]).replace(/\//g, ".");
}