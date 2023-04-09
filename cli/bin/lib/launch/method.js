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
		let imp = await import("file://" + path);
		Anotherback.createMethod(convertor(path, "method"), imp.default);
		for(const key in imp){
			if(key === "default") continue;
			Anotherback.createMethod(convertor(path, "method") + "::" + key, imp[key]);
		}
	});
	await Promise.all(arr);
}
