import { createClient } from "./client";
import { createServer, error } from "./server";

const context = { user: { id: 1, name: "Bob Ross" } };

const queries = {
  getUser: (_: void, ctx: typeof context) => {
    return ctx.user;
  },
  getUserByName: ({ name }: { name: string }, ctx: typeof context) => {
    if (ctx.user.name === name) return ctx.user;
    return error("NotFound", `no existing user with name "${name}"`);
  },
};

const mutations = {
  updateUser: (
    {
      id,
      payload,
    }: {
      id: number;
      payload: { name: string };
    },
    ctx: typeof context
  ) => {
    if (ctx.user.id === id) {
      ctx.user.name = payload.name;
      return ctx.user;
    }
    return error(`no existing user with id ${id}`);
  },
};

const subscriptions = {
  userNameUpdate: () => {
    return "sub";
  },
};

const server = createServer({
  context,
  queries,
  mutations,
  subscriptions,
});

server.listen("3030");

const c = createClient<typeof server>("http://localhost:3030");

c.query("getUser", undefined).then((u) => console.log(u));
c.query("getUserByName", { name: "B Ross" }).then((u) => console.log(u));
c.mutate("updateUser", { id: 1, payload: { name: "Not Bob Anymore " } }).then(
  (u) => console.log(u)
);
c.subscribe("userNameUpdate", undefined).then((u) => console.log(u));
