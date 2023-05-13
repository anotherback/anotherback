import Joi from "joi";
import env from "./env";

export declare class DefaultContext {
	sender(name: string, info?: string, data?: string): never;

	schema(name: string, value: any): Joi.ValidationResult<>;

	method(name: string, ...args: any): any | Promise<any>;

	readonly token: {
        generate(nameKey: string, info: object): void;
        verify(nameKey: string): object | false | null;
        read(nameKey: string): object | null;
        refresh(nameKey: string): undefined | false;
        delete(nameKey: string): undefined | false;
    }

	pass(key: string | object | undefined, value: any): any;

	readonly env: env;
}

export declare class AccessCtx extends DefaultContext {
	otherAccess(name: string, exec: boolean): Promise<boolean>;
}

export declare class CheckerCtx extends DefaultContext {
	
}

export declare class RequestCtx extends DefaultContext {

}

export declare class MethodCtx {
	method(name: string, ...args: any): any | Promise<any>;
}