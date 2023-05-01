import {Anotherback} from "../../../../src/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import {resolve} from "path";

export default async function handler(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.handler))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.handler, async(path) => {
		let imp = await import("file://" + path);
		for(const key in imp){
			if(key === "default") Anotherback.createHandler(convertor(path, "handler"), imp.default);
			else Anotherback.createHandler(convertor(path, "handler") + "::" + key, imp[key]);
		}
	});
	await Promise.all(arr);
}
