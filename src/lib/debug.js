
import Anotherback from "./anotherback.js";
import Route from "./route.js";
import {parse} from "@typescript-eslint/typescript-estree";

export function checkUpstreamError(){
	for(const name in Anotherback.snack.accesses){
		checkMethodsOrSendersOrAccessUsed(Anotherback.snack.accesses[name])
		.forEach(([type, n, arg]) => {
			if(type === "otherAccess")console.error(`Access "${name}" calls other access "${n}" but it does not exist.`);
			else if(arg === undefined)console.error(`Access "${name}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Access "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}

	for(const name in Anotherback.snack.checkers){
		checkMethodsOrSendersOrAccessUsed(Anotherback.snack.checkers[name].fnc)
		.forEach(([type, n, arg]) => {
			if(type === "otherAccess") return;
			else if(arg === undefined)console.error(`Checker "${name}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Checker "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}

	for(const name in Anotherback.snack.methods){
		checkMethodsOrSendersOrAccessUsed(Anotherback.snack.methods[name])
		.forEach(([type, n, arg]) => {
			if(type === "otherAccess") return;
			else if(arg === undefined)console.error(`Method "${name}" uses method "${n}" but it does not exist.`);
			else console.error(`Method "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}


	for(const [params, fnc] of Route.routes){
		checkMethodsOrSendersOrAccessUsed(fnc)
		.forEach(([type, n, arg]) => {
			if(type === "otherAccess") return;
			else if(arg === undefined)console.error(`Route "${params.method}:${params.path}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Route "${params.method}:${params.path}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
		
		let pass = [];

		pass = computePass(
			params.regAccess,
			pass,
			(arg, name) => {
				if(name !== undefined)console.error(`An access of the route "${params.method}:${params.path}" calls other access named "${name}" which fetches "${arg}" but it has never been passed before.`);
				else console.error(`Register access of the route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`);
			}
		);

		pass = computePass(
			params.access,
			pass,
			(arg, name) => {
				if(name !== undefined)console.error(`An access of the route "${params.method}:${params.path}" calls other access named "${name}" which fetches "${arg}" but it has never been passed before.`);
				else console.error(`Access of the route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`);
			}
		);

		for(const loc of params.schema.keys){
			for(const obj of params.schema[loc]){
				pass.push(obj.pass);
			}
		}

		for(const [key, {fnc}] of Object.entries(params.checkers)){
			pass = computePass(
				fnc, 
				pass, 
				arg => console.error(`Checker ${parseInt(key) + 1} of the route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`)
			);
		}

		pass = computePass(
			fnc, 
			pass, 
			arg => console.error(`Route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`)
		);
	}
}

function computePass(fnc, pass, callback){
	deepSearch(
		parse(
			fnc.toString()
			.replace(/^function[^(]*\(/, "function verif(")
			.replace(/^async function[^(]*\(/, "async function verif(")
		),
		{
			CallExpression: [
				{
					callee: {
						type: "MemberExpression",
						object: {
							type: "ThisExpression"
						},
						property: {
							type: "Identifier",
							name: "pass"
						}
					}
				},
				{
					callee: {
						type: "MemberExpression",
						object: {
							type: "ThisExpression"
						},
						property: {
							type: "Identifier",
							name: "otherAccess"
						}
					}
				}
			],
			ExpressionStatement: {}
		},
		(obj) => {
			if(
				obj.type === "ExpressionStatement" && 
				obj.directive !== undefined && 
				obj.directive.startsWith("aob-pass:")
			)pass.push(obj.directive.split(":")[1]);
			
			if(obj.type === "ExpressionStatement") return;
			
			const type = obj.callee.property.name;
			const args = obj.arguments;

			if(type === "pass"){
				if(args[0] !== undefined && args[1] !== undefined && args[0].type === "Literal"){
					pass.push(args[0].value);
				}
				else if(args[0] !== undefined && args[1] === undefined && args[0].type === "Literal"){
					if(pass.indexOf(args[0].value) === -1)callback(args[0].value);
				}
				else if(args[0] !== undefined && args[1] === undefined && args[0].type === "ObjectExpression"){
					for(const prop of args[0].properties){
						if(prop.type === "Property" && prop.key.name !== undefined)pass.push(prop.key.name);
					}
				}
			}
			else if(type === "otherAccess"){
				if(args[0].type !== "Literal") return;
				const n = args[0].value;
				if(Anotherback.snack.accesses[n] === undefined) return;
				pass = computePass(
					Anotherback.snack.accesses[n],
					pass,
					(arg, name) => callback(arg, name || n)
				);
			}
		} 
	);

	return pass;
}

function checkMethodsOrSendersOrAccessUsed(fnc){
	const notExist = [];
	deepSearch(
		parse(
			fnc.toString()
			.replace(/^function[^(]*\(/, "function verif(")
			.replace(/^async function[^(]*\(/, "async function verif(")
		),
		{
			CallExpression: [
				{
					callee: {
						type: "MemberExpression",
						object: {
							type: "ThisExpression"
						},
						property: {
							type: "Identifier",
							name: "sender"
						}
					}
				},
				{
					callee: {
						type: "MemberExpression",
						object: {
							type: "ThisExpression"
						},
						property: {
							type: "Identifier",
							name: "method"
						}
					}
				},
				{
					callee: {
						type: "MemberExpression",
						object: {
							type: "ThisExpression"
						},
						property: {
							type: "Identifier",
							name: "otherAccess"
						}
					}
				}
			]
		},
		(obj) => {
			const type = obj.callee.property.name;
			const args = obj.arguments;
			const name = args[0].value;
			if(name === undefined) return;

			if(type === "method"){
				if(Anotherback.snack.methods[name] === undefined)notExist.push(["method", name]);
				else if(Anotherback.snack.methods[name].length !== args.length - 1)notExist.push([
					"method", 
					name,
					[
						Anotherback.snack.methods[name].length, 
						args.length - 1
					]
				]);
			}
			else if(type === "sender"){
				if(Anotherback.snack.senders[name] === undefined)notExist.push(["sender", name]);
			}
			else if(type === "otherAccess"){
				if(Anotherback.snack.accesses[name] === undefined)notExist.push(["otherAccess", name]);
			}
		}
	);
	return notExist;
}

function deepSearch(obj, objSearch, callback){
	for(const key in obj){
		if(objSearch[obj[key]?.type] !== undefined){
			for(const compObj of Array.isArray(objSearch[obj[key]?.type]) ? objSearch[obj[key]?.type] : [objSearch[obj[key]?.type]]){
				if(compareObject(compObj, obj[key]) === true)callback(obj[key]);
			}
		}
		if(typeof obj[key] === "object")deepSearch(obj[key], objSearch, callback);
	}
}

function compareObject(objRef, objCompare){
	for(const key in objRef){
		if(typeof objRef[key] === "object" && typeof objCompare[key] === "object"){
			if(compareObject(objRef[key], objCompare[key]) !== true) return false;
		}
		else if(typeof objRef[key] === "object" && typeof objCompare[key] !== "object") return false;
		else if(objRef[key] !== objCompare[key]) return false;
	}

	return true;
}
