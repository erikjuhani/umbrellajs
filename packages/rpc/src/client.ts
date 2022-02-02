import ws from "ws";
import { get, request } from "http";
import { emit, eventStream } from "@umbrellajs/event-stream";

import type { Resolvers, Subscriptions } from "./server";

export interface ClientSchema<
  Queries extends Resolvers = Resolvers,
  Mutations extends Resolvers = Resolvers,
  TSubscriptions extends Subscriptions = Subscriptions
> {
  queries?: Queries;
  mutations?: Mutations;
  subscriptions?: TSubscriptions;
}

export interface Subscriber<Payload> {
  broadcast: (payload: Payload) => Subscriber<Payload>;
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
    route: K & string,
    listener?: (
      data: Parameters<
        Parameters<
          Fn extends (...args: any[]) => any
            ? Fn
            : (send: (data: any) => void) => void
        >[0]
      >[0]
    ) => void
  ) => Subscriber<
    Parameters<
      Parameters<
        Fn extends (...args: any[]) => any
          ? Fn
          : (send: (data: any) => void) => void
      >[0]
    >[0]
  >;
}

function createWebsocketConnection(host: string) {
  const socket = new ws(`ws://${host}/websocket`);

  function send(socket: ws) {
    return (
      route: string,
      payload: { type: "broadcast" | "subscription"; data?: any }
    ) => {
      const connecting = setInterval(() => {
        if (socket.readyState === ws.OPEN) {
          socket.send(JSON.stringify({ route, payload }));
          clearInterval(connecting);
        }
        if (socket.readyState === ws.CLOSED) {
          clearInterval(connecting);
        }
      }, 10);
    };
  }

  return {
    on: socket.on.bind(socket),
    send: send(socket),
  };
}

export function createClient<Schema extends ClientSchema>(
  serverAddress: string
): Client<Schema> {
  const url = new URL(serverAddress + "/websocket");
  const stream = eventStream<any>();
  const ws = createWebsocketConnection(`${url.hostname}:${url.port}`);

  ws.on("message", (e) => {
    const { route, payload } = JSON.parse(e.toString());
    emit(route, payload.data, stream);
  });

  ws.on("error", (e) => {
    console.log(e.message);
  });

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
    subscribe: (route, listener) => {
      ws.send(route, { type: "subscription" });

      if (listener) {
        stream.subscribe(route, listener);
      }

      const subscriber = {
        broadcast: (data: any) => {
          ws.send(route, { type: "broadcast", data });
          return subscriber;
        },
      };

      return subscriber;
    },
  };
}
