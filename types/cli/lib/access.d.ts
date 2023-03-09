import { createAccessFnc, createAccessObj } from "../../dist/lib/anotherback";

export default function access<R>(obj: createAccessObj<R>, fnc: createAccessFnc<R>): void;