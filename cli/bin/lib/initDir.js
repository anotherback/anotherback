import fs from "fs";
import {Directories, Files, Models} from "../../directories.js";
import {resolve} from "path";

function find(path, fnc){
	for(const file of fs.readdirSync(path)){
		if(fs.lstatSync(resolve(path, file)).isDirectory())find(resolve(path, file), fnc);
		else fnc(resolve(path, file));
	}
}

export default function initDir(){
	if(!fs.existsSync(Directories.workdir))fs.mkdirSync(Directories.workdir);
	if(!fs.existsSync(Directories.import))fs.mkdirSync(Directories.import);
	if(!fs.existsSync(Files.token))Models.rw.token = Files.token;
	if(!fs.existsSync(Files.notfound))Models.rw.notfound = Files.notfound;

	if(!fs.existsSync(Directories.access))fs.mkdirSync(Directories.access);
	find(
		Directories.access,
		path => {
			if(
				fs.readFileSync(path, "utf-8") === "" &&
				path.endsWith(Files.extname.access)
			)Models.rw.access = path;
		}
	);

	if(!fs.existsSync(Directories.checker))fs.mkdirSync(Directories.checker);
	find(
		Directories.checker,
		path => {
			if(
				fs.readFileSync(path, "utf-8") === "" &&
				path.endsWith(Files.extname.checker)
			)Models.rw.checker = path;
		}
	);

	if(!fs.existsSync(Directories.register))fs.mkdirSync(Directories.register);
	find(
		Directories.register,
		path => {
			if(
				fs.readFileSync(path, "utf-8") === "" &&
				path.endsWith(Files.extname.register)
			)Models.rw.register = path;
		}
	);

	if(!fs.existsSync(Directories.method))fs.mkdirSync(Directories.method);
	find(
		Directories.method,
		path => {
			if(
				fs.readFileSync(path, "utf-8") === "" &&
				path.endsWith(Files.extname.method)
			)Models.rw.method = path;
		}
	);

	if(!fs.existsSync(Directories.sender))fs.mkdirSync(Directories.sender);
	find(
		Directories.sender,
		path => {
			if(
				fs.readFileSync(path, "utf-8") === "" &&
				path.endsWith(Files.extname.sender)
			)Models.rw.method = path;
		}
	);
}
