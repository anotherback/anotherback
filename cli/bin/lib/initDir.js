import fs from "fs";
import {Directories, Files, Models} from "../../directories.js";
import {resolve} from "path";

const config = (await import("file://" + Files.config)).default;

function find(path, fnc){
	for(const file of fs.readdirSync(path)){
		if(fs.lstatSync(resolve(path, file)).isDirectory())find(resolve(path, file), fnc);
		else fnc(resolve(path, file));
	}
}

export default function initDir(DIRS){
	if(!fs.existsSync(Directories.workdir))fs.mkdirSync(Directories.workdir);
	if(!fs.existsSync(Directories.import))fs.mkdirSync(Directories.import);
	if(!fs.existsSync(Files.token))Models.rw.token = Files.token;
	if(!fs.existsSync(Files.notfound))Models.rw.notfound = Files.notfound;
	if(!fs.existsSync(Files.error))Models.rw.error = Files.error;
	if(!fs.existsSync(Files.env))Models.rw.env = Files.env;

	if(
		typeof config.registerParamsStatic === "object" && 
		config.registerParamsStatic.root !== undefined && 
		!fs.existsSync(resolve(config.registerParamsStatic.root))
	)fs.mkdirSync(resolve(config.registerParamsStatic.root), {recursive: true});

	for(const DIR of DIRS){
		if(!fs.existsSync(Directories[DIR]))fs.mkdirSync(Directories[DIR]);
		find(
			Directories[DIR],
			path => {
				if(
					fs.readFileSync(path, "utf-8") === "" &&
					path.endsWith(Files.extname[DIR])
				)Models.rw[DIR] = path;
			}
		);
	}
}
