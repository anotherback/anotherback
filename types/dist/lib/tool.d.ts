import { FastifyRequest, FastifyReply } from "fastify";

export type addMethodfnc = (req: FastifyRequest, res: FastifyReply, toolBox: Tool, ...args: any) => any;
export type addSenderfnc = (res: FastifyReply, toolBox: Tool, ...args: any) => any;

export default class Tool {
    successful(data: object): void;

    error(data: object): void;

    redirect(url: string): void;

    readonly token: {
        generate(nameKey: string, info: object): void;
        verify(nameKey: string): object | false | null;
        read(nameKey: string): object | null;
        refresh(nameKey: string): void;
        delete(nameKey: string): void;
    }

    method(name: string, ...args: any): any | Promise<any>;

    sender(name: string, ...args: any): any | Promise<any>;

    status: number;

    info: string;

    data(key: string | undefined, value: any): any;

    pass(key: string | undefined | object, value: any): any;

    otherAccess(name: string): (false | undefined | true) | Promise<(false | undefined | true)>;

    otherChecker(name: string): (false | undefined | true) | Promise<(false | undefined | true)>;

    req: FastifyRequest;

    res: FastifyReply;

    static readonly methods: {
        [key: string]: Function;
    }

    static addMethod(name: string, fnc: addMethodfnc): void;

    static addSender(name: string, fnc: addSenderfnc): void;
}

interface def {
    readonly t: Tool["token"];
    status: Tool["status"];
    info: Tool["info"];
    data: Tool["data"];
    pass: Tool["pass"];
    method: Tool["method"];
    sender: Tool["sender"];
    box: Tool;
}

export interface toolAccess extends def {
    otherAccess: Tool["otherAccess"];
    e: Tool["error"];
    r: Tool["redirect"];
}

export interface toolChecker extends def {
    otherChecker: Tool["otherChecker"];
    e: Tool["error"];
}

export interface toolRequest extends def {
    s: Tool["successful"];
    e: Tool["error"];
    r: Tool["redirect"];
} 