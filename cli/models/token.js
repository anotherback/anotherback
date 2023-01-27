import { token } from "anotherback/cli";

export default token(
    [
        {
            name: "myToken",
            key: "secret",
            options: {
                generate: {
                    expiresIn: "3h",
                },
                verify: {

                },
                cookie: {
                    httpOnly: false,
                },
            }
        },
    ]
);