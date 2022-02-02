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
  randomNumber: (send: (value: number) => void, _context: typeof context) => {
    let tick = 1000 * Math.random();

    const interval = () => {
      send(Math.random());
      tick = 1000 * Math.random();
      setTimeout(interval, tick);
    };

    setTimeout(interval, tick);
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

c.query("getUser", undefined).then(console.log);
c.query("getUserByName", { name: "B Ross" }).then(console.log);
c.mutate("updateUser", {
  id: 1,
  payload: { name: "Not Bob Anymore " },
}).then(console.log);

c.subscribe("randomNumber", (data) =>
  console.log("[CLIENT 1]:", data)
).broadcast(3);

createClient<typeof server>("http://localhost:3030")
  .subscribe("randomNumber", (data) => console.log("[CLIENT 2]:", data))
  .broadcast(6);
