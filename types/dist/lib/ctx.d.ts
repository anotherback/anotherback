declare class DefaultContext {
	sender(name: string, ...args: any): void;

	method(name: string, ...args: any): any | Promise<any>;

	readonly token: {
        generate(nameKey: string, info: object): void;
        verify(nameKey: string): object | false | null;
        read(nameKey: string): object | null;
        refresh(nameKey: string): void;
        delete(nameKey: string): void;
    }

	pass(key: string | object | undefined, value: any): any;
}

export declare class AccessCtx extends DefaultContext {
	otherAccess(name: string, launcher: string | undefined): (false | undefined | true) | Promise<(false | undefined | true)>;
}

export declare class CheckerCtx extends DefaultContext {
	otherChecker(name: string, launcher: string | undefined): (false | undefined | true) | Promise<(false | undefined | true)>;
}

export declare class RequestCtx extends DefaultContext {

}

export declare class SenderCtx {
	successful(): void;

    error(): void;

    redirect(url: string): void;

	code(code: number): number | undefined;

	info(info: string): string | undefined;

	data(data: any): any;
}