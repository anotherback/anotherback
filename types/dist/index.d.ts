import Anotherback from "./lib/anotherback";
import Token from "./lib/token";
import { AccessCtx as AC, CheckerCtx as CC, RequestCtx as RC, SenderCtx as SC } from "./lib/ctx";

declare class StaticMethod{
	static addProperty(name: string, property: any): void;
	static addGetter(name: string, fnc: () => any): void;
	static addSetter(name: string, fnc: (arg: any) => void): void;
}

declare class AccessCtx extends AC extends StaticMethod{}
declare class CheckerCtx extends CC extends StaticMethod{}
declare class RequestCtx extends RC extends StaticMethod{}
declare class SenderCtx extends SC extends StaticMethod{}

export {
    Anotherback,
    Token,
	AccessCtx,
	CheckerCtx,
	RequestCtx,
	SenderCtx
}