import { Server } from "https://deno.land/x/kilat/mod.ts";
import { buildSchema, GraphQLHTTP } from '../mod.ts'

// TEST curl -X POST localhost:3000/graphql -d '{ "query": "{ hello }" }'

const port = 3000;
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)

const rootValue = { hello: (_root: undefined, _args: unknown) => `Hello World! ${JSON.stringify(_args)}` } ;
const server = new Server();
server.post(
    "/graphql",
    async (ctx: any, next: any) => {
        const resp = await GraphQLHTTP<Request>({ schema, rootValue, context: (request) => ({ request }) })(ctx.req);
        ctx.res = resp;
        await next();
    },
);
console.log(`server listen to http://localhost:${port}`);
await server.listen({ port });