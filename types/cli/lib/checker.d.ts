import { createCheckerFnc, createCheckerObj } from "../../dist/lib/anotherback";

export default function checker<R extends {}>(obj: createCheckerObj<R>, fnc: createCheckerFnc<R>): void;