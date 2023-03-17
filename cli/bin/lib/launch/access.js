import {Anotherback} from "../../../../dist/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import {resolve} from "path";

export default async function access(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.access))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.access, async(path) => {
		let imp = (await import("file://" + path)).default;
		Anotherback.createAccess(convertor(path, "access"), imp);
	});
	await Promise.all(arr);
}
