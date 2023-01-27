#! /usr/bin/env node

import Watcher from "watcher";
import { Directories, Models, Files } from "../directories.js";
import { spawn } from "child_process";
import initDir from "./lib/initDir.js";
import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
if(!fs.existsSync(Files.config))Models.rw.config = Files.config;
await import("file://" + Files.config);
import Event, { Dir } from "./lib/plugins.js";

await Event.launch("start", Directories, Models, Dir, Files);

class child{
    static start(){
        this.process = spawn("node", [resolve(dirname(fileURLToPath(import.meta.url))) + "/lib/spawn.js"], {stdio: "inherit"});
    }

    static stop(){
        try{
            process.kill(this.process.pid);
            return true;
        }catch{
            return false
        };
        
    }

    static restart(){
        console.log("anotherback restart");
        if(this.stop())this.start();
    }

    static process
}

initDir();

new Watcher(Directories.access, {recursive: true, ignoreInitial: true})
.on("add", path=>{if(fs.readFileSync(path, "utf-8") === "")Models.rw.access=path});

new Watcher(Directories.checker, {recursive: true, ignoreInitial: true})
.on("add", path=>{if(fs.readFileSync(path, "utf-8") === "")Models.rw.checker=path});

new Watcher(Directories.register, {recursive: true, ignoreInitial: true})
.on("add", path=>{if(fs.readFileSync(path, "utf-8") === "")Models.rw.register=path});

new Watcher(Directories.method, {recursive: true, ignoreInitial: true})
.on("add", path=>{if(fs.readFileSync(path, "utf-8") === "")Models.rw.method=path});

await Event.launch("initDir");

new Watcher(Directories.main, {recursive:true, ignoreInitial: true, ignore:path=>path.indexOf("node_modules") > -1 || path.indexOf("package-lock.json") > -1}).on("change", ()=>child.restart()).on("unlink", ()=>child.restart());

process.on("SIGINT", () => {
    child.stop();
});

process.on("exit", () => {
    child.stop();
});

child.start();