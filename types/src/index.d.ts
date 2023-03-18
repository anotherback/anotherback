import Anotherback from "./lib/anotherback";
import Token from "./lib/token";
import env from "./lib/env";
declare class StaticMethod{
	static addProperty(name: string, property: any): void;
	static addGetter(name: string, fnc: () => any): void;
	static addSetter(name: string, fnc: (arg: any) => void): void;
}

declare class AccessCtx extends StaticMethod{}
declare class CheckerCtx extends StaticMethod{}
declare class RequestCtx extends StaticMethod{}

export {
    Anotherback,
    Token,
	AccessCtx,
	CheckerCtx,
	RequestCtx,
	env,
}