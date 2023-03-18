import { createCheckerFnc, createCheckerObj } from "../../src/lib/anotherback";

export default function checker<R extends {}>(obj: createCheckerObj<R>, fnc: createCheckerFnc<R>): void;