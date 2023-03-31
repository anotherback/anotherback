
import Anotherback from "./anotherback.js";
import Route from "./route.js";
import {parse} from "@typescript-eslint/typescript-estree";

export function checkUpstreamError(){
	for(const name in Anotherback.snack.accesses){
		checkMethodsOrSendersUsed(
			Anotherback.snack.accesses[name], 
			{
				otherAccess: ({args}) => {
					if(args[0].type !== "Literal") return;
					const n = args[0].value;
					if(Anotherback.snack.accesses[n] === undefined) console.error(`Access "${name}" calls other access "${n}" but it does not exist.`);
				},
			}
		)
		.forEach(([type, n, arg]) => {
			if(arg === undefined)console.error(`Access "${name}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Access "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}

	for(const name in Anotherback.snack.checkers){
		checkMethodsOrSendersUsed(Anotherback.snack.checkers[name].fnc)
		.forEach(([type, n, arg]) => {
			if(arg === undefined)console.error(`Checker "${name}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Checker "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}

	for(const name in Anotherback.snack.methods){
		checkMethodsOrSendersUsed(Anotherback.snack.methods[name])
		.forEach(([type, n, arg]) => {
			if(arg === undefined)console.error(`Method "${name}" uses method "${n}" but it does not exist.`);
			else console.error(`Method "${name}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});
	}

	for(const [params, fnc] of Route.routes){
		checkMethodsOrSendersUsed(fnc)
		.forEach(([type, n, arg]) => {
			if(arg === undefined)console.error(`Route "${params.method}:${params.path}" uses ${type} "${n}" but it does not exist.`);
			else console.error(`Route "${params.method}:${params.path}" calls method "${n}" with ${arg[1]} argument(s) but it needs ${arg[0]}.`);
		});

		let pass = [];
		function recurAccess(fnc, callback){
			pass = computePass(
				fnc, 
				pass, 
				callback,
				{
					otherAccess: ({args}) => {
						if(args[0].type !== "Literal") return;
						const n = args[0].value;
						if(Anotherback.snack.accesses[n] === undefined) return;
						recurAccess(
							Anotherback.snack.accesses[n], 
							arg => console.error(`An access of the route "${params.method}:${params.path}" calls other access named "${n}" which fetches "${arg}" but it has never been passed before.`)
						);
					}
				}
			);
		}

		recurAccess(
			params.regAccess,
			arg => console.error(`Register access of the route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`)
		);

		recurAccess(
			params.access,
			arg => console.error(`Access of the route "${params.method}:${params.path}" fetches "${arg}" but it has never been passed before.`)
		);

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

function computePass(fnc, pass, callback, obj = {}){

	findCallMemberExpression(
		fnc,
		{
			pass: ({args}) => {
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
			},
			directive: (directive) => {
				if(directive.startsWith("aob-pass:"))pass.push(directive.split(":")[1]);
			},
			...obj,
		},
	);

	return pass;
}

function missingPass(pass, pickup){
	let missing = [];
	for(const value of pickup){
		if(pass.indexOf(value) === -1)missing.push(value);
	}
	return [...new Set(missing)];
}

function checkMethodsOrSendersUsed(fnc, obj = {}){
	const notExist = [];
	findCallMemberExpression(
		fnc, 
		{
			method: ({args}) => {
				if(args[0].type !== "Literal") return;
				const name = args[0].value;
				if(Anotherback.snack.methods[name] === undefined)notExist.push(["method", name]);
				else if(Anotherback.snack.methods[name].length !== args.length - 1)notExist.push([
					"method", 
					name,
					[
						Anotherback.snack.methods[name].length, 
						args.length - 1
					]
				]);
			},
			sender: ({args}) => {
				if(args[0].type !== "Literal") return;
				const name = args[0].value;
				if(Anotherback.snack.senders[name] === undefined)notExist.push(["sender", name]);
			},
			...obj
		}
	);
	return notExist;
}

function findCallMemberExpression(fnc, obj){
	(function finding(tree){
		if(tree.body !== undefined && typeof tree.body === "object" && !Array.isArray(tree.body))finding(tree.body);
		else if(tree.body !== undefined && typeof tree.body === "object" && Array.isArray(tree.body)){
			for(const child of tree.body){
				if(child.body !== undefined)finding(child.body);
				else if(
					child.type === "ExpressionStatement" && 
					child?.expression?.type === "CallExpression" && 
					child?.expression?.callee?.type === "MemberExpression" &&
					child?.expression?.callee?.object?.type === "ThisExpression" &&
					child?.expression?.callee?.property?.type === "Identifier" &&
					obj[child?.expression?.callee?.property?.name] !== undefined
				){
					obj[child.expression.callee.property.name]({
						args: child.expression.arguments,
						name: child.expression.callee.property.name
					});
				}
				else if(
					child.directive?.startsWith("aob-") === true && 
					obj.directive !== undefined
				)obj.directive(child.directive);
			}
		}
	})(parse(fnc.toString().replace(/^function[^(]*\(/, "function verif(")));
}

function regexToTable(regex, string){
	let table = [];

	string.replace(
		regex, 
		(match, ...groups) => {
			groups.pop();
			groups.pop();
			table.push([match, groups]);
			return "";
		}
	);

	return table;
}
