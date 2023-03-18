import {sender} from "anotherback/cli";

export default sender(
	(res, info, data) => (
		{
			code: 404,
			info: info,
			data: `Route '${data.method}:${data.url}' not found.`
		}
	)
);
