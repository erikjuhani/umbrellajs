import ws from "ws";
import { get, request } from "http";

import type { Resolvers } from "./server";

export interface ClientSchema<
  Queries extends Resolvers = Resolvers,
  Mutations extends Resolvers = Resolvers,
  Subscriptions extends Resolvers = Resolvers
> {
  queries?: Queries;
  mutations?: Mutations;
  subscriptions?: Subscriptions;
}

export interface Client<Schema extends ClientSchema> {
  query: <K extends keyof Schema["queries"], Fn extends Schema["queries"][K]>(
    route: K,
    args: Parameters<Fn extends (...args: any[]) => any ? Fn : () => void>[0]
  ) => Promise<
    ReturnType<Fn extends (...args: any[]) => any ? Fn : () => void>
  >;
  mutate: <
    K extends keyof Schema["mutations"],
    Fn extends Schema["mutations"][K]
  >(
    route: K,
    args: Parameters<Fn extends (...args: any[]) => any ? Fn : () => void>[0]
  ) => Promise<
    ReturnType<Fn extends (...args: any[]) => any ? Fn : () => void>
  >;
  subscribe: <
    K extends keyof Schema["subscriptions"],
    Fn extends Schema["subscriptions"][K]
  >(
    route: K,
    args: Parameters<Fn extends (...args: any[]) => any ? Fn : () => void>[0]
  ) => Promise<
    ReturnType<Fn extends (...args: any[]) => any ? Fn : () => void>
  >;
}

export function createClient<Schema extends ClientSchema>(
  serverAddress: string
): Client<Schema> {
  const url = new URL(serverAddress + "/websocket");
  const s = new ws("ws://" + url.hostname + ":" + url.port + "/websocket");

  return {
    query: (route, args) => {
      const url = new URL(serverAddress + "/" + route);
      const params = new URLSearchParams(args);
      url.search = params.toString();

      const data: any[] = [];

      return new Promise((resolve) => {
        get(url.toString(), (res) => {
          res.on("data", (chunk) => {
            data.push(chunk);
          });

          res.on("end", () => {
            resolve(JSON.parse(data.toString()));
          });
        });
      });
    },
    mutate: (route, args) => {
      const url = new URL(serverAddress + "/" + route);

      const data: any[] = [];

      const requestData = JSON.stringify(args);

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestData),
        },
      };

      return new Promise((resolve) => {
        const req = request(options, (res) => {
          res.on("data", (chunk) => {
            data.push(chunk);
          });

          res.on("end", () => {
            resolve(JSON.parse(data.toString()));
          });
        });

        req.write(requestData);
        req.end();
      });
    },
    subscribe: (route, args) => {
      // TODO: Return a subscriber from this instead.
      s.on("open", () => {
        s.send(JSON.stringify({ route, args }));
      });

      return new Promise((resolve) => {
        s.on("message", (e) => {
          resolve(JSON.parse(e.toString()));
        });
      });
    },
  };
}
