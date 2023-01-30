import { Anotherback } from "../../../../dist/index.js";
import { Directories, Files } from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import { resolve } from "path";

export default async function checker(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.checker))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.checker, async (path) => {
		Anotherback.createChecker(convertor(path, "checker"), (await import("file://" + path)).default);
	});
	await Promise.all(arr);
}
