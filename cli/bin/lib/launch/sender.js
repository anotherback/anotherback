import {Tool} from "../../../../dist/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import {resolve} from "path";

export default async function sender(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.sender))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.sender, async (path) => {
		Tool.addSender(convertor(path, "sender"), (await import("file://" + path)).default);
	});
	await Promise.all(arr);
}
