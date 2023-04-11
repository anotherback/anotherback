import { schemaErrorFnc } from "../../src/lib/anotherback";
import Joi from "joi";

export default function sender(schema: Joi.AnySchema, fnc: schemaErrorFnc): void;