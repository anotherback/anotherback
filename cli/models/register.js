import { register, registerOptions } from "anotherback/cli";

export const options = registerOptions(
	{
		prefix: "",
		access: "",
		checkers: [],
	}
);

export default register(
	(reg, hook) => {

	}
);
