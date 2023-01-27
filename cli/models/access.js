import { access } from "anotherback/cli";

export default access(
    (req, res, tools) => {
        return true;
    }
);