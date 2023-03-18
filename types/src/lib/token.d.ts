import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { CookieSerializeOptions } from "@fastify/cookie";

export interface optionsCreateKeys {
    generate: SignOptions;
    verify: VerifyOptions;
    cookie: CookieSerializeOptions;
}

export default class Token {
    static generate(nameKey: string, info: object): string;

    static verify(token: string, nameKey: string): object | false;

    static read(token: string): object;

    static refresh(token: string, nameKey: string): string;

    static get keys(): Keys;
}

declare class Keys{
    static create(name: string, key: string, options: optionsCreateKeys): void;

    static get(name: string): object;
}