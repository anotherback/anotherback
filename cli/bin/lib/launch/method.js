import {Anotherback} from "../../../../src/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import {resolve} from "path";

export default async function method(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.method))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.method, async(path) => {
		Anotherback.createMethod(convertor(path, "method"), (await import("file://" + path)).default);
	});
	await Promise.all(arr);
}
