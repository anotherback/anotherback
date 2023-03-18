import env from "./env";

declare class DefaultContext {
	sender(name: string, info?: string, data?: string): never;

	method(name: string, ...args: any): any | Promise<any>;

	readonly token: {
        generate(nameKey: string, info: object): void;
        verify(nameKey: string): object | false | null;
        read(nameKey: string): object | null;
        refresh(nameKey: string): void;
        delete(nameKey: string): void;
    }

	pass(key: string | object | undefined, value: any): any;

	readonly env: env;
}

export declare class AccessCtx extends DefaultContext {
	otherAccess(name: string): Promise<boolean>;
}

export declare class CheckerCtx extends DefaultContext {
	
}

export declare class RequestCtx extends DefaultContext {

}