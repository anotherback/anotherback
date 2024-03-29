import {Anotherback} from "../../../../src/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import {resolve} from "path";

export default async function register(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.register))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.register, async(path) => {
		Anotherback.register((await import("file://" + path)).options, (await import("file://" + path)).default);
	});
	await Promise.all(arr);
}
