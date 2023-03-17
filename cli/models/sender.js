import {sender} from "anotherback/cli";

export default sender(
	(res, info, data) => (
		{
			code: 200,
			info: info,
			data: data
		}
	)
);
