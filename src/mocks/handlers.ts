import { rest } from "msw";


function getPosts() {
    return rest.post("https://eowdxi3ymnvlrmg.m.pipedream.net", (req, res, ctx) => {
        return res(
            ctx.status(200),
        );
    });
}

export const handlers = [getPosts()];