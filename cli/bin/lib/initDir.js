import fs from "fs";
import {Directories, Files, Models} from "../../directories.js";
import {resolve} from "path";
import {Linter} from "eslint";

const config = (await import("file://" + Files.config)).default[0];
const configCli = (await import("file://" + Files.config)).default[1] || {linter: false, hotReload: false};
const linter = new Linter();
let linterConfig = JSON.parse(fs.readFileSync(Files.eslintrc));

function find(path, fnc){
	for(const file of fs.readdirSync(path)){
		if(fs.lstatSync(resolve(path, file)).isDirectory())find(resolve(path, file), fnc);
		else fnc(resolve(path, file));
	}
}

function linterFix(path){
	if(configCli.linter !== true) return;

	const content = fs.readFileSync(
		path, 
		"utf-8"
	);

	const fixedCode = linter.verifyAndFix(
		content,		
		linterConfig
	);

	if(content !== fixedCode.output){
		fs.writeFileSync(
			path, 
			fixedCode.output
		);
		return true;
	}
	else {
		return false;
	}
}

export default function initDir(DIRS){
	linterFix(Files.config);

	if(!fs.existsSync(Directories.workdir))fs.mkdirSync(Directories.workdir);
	if(!fs.existsSync(Directories.import))fs.mkdirSync(Directories.import);

	if(!fs.existsSync(Files.token))Models.rw.token = Files.token;
	else linterFix(Files.token);

	if(!fs.existsSync(Files.notfound))Models.rw.notfound = Files.notfound;
	else linterFix(Files.notfound);
	
	if(!fs.existsSync(Files.error))Models.rw.error = Files.error;
	else linterFix(Files.error);

	if(!fs.existsSync(Files.env))Models.rw.env = Files.env;
	if(!fs.existsSync(Files.eslintrc))Models.rw.eslintrc = Files.eslintrc;

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
				else linterFix(path);
			}
		);
	}
}
