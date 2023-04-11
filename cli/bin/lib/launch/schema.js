import {Anotherback} from "../../../../src/index.js";
import {Directories, Files} from "../../../directories.js";
import fs from "fs";
import convertor from "../convertor.js";
import {resolve} from "path";

export default async function schema(){
	let arr = [];
	(function find(path, fnc){
		for(const file of fs.readdirSync(path)){
			if(fs.lstatSync(resolve(path, file)).isDirectory()) find(resolve(path, file), fnc);
			if(file.endsWith(Files.extname.schema))arr.push(fnc(resolve(path, file)));
		}
	})(Directories.schema, async(path) => {
		let imp = await import("file://" + path);
		for(const key in imp){
			if(key === "default") Anotherback.createSchema(convertor(path, "schema"), imp.default[0], imp.default[1]);
			else Anotherback.createSchema(convertor(path, "schema") + "::" + key, imp[key][0], imp[key][1]);
		}
	});
	await Promise.all(arr);
}
