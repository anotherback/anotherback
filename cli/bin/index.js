#! /usr/bin/env node

import fs from "fs";
import { Models, Files } from "../directories.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

if(!fs.existsSync(Files.config))Models.rw.config = Files.config;
await import("file://" + Files.config);

await import("file://" + resolve(dirname(fileURLToPath(import.meta.url))) + "/launcher.js");
