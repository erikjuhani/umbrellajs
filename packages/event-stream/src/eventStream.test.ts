import { emit, eventEmitter, eventStream } from "./eventStream";
import { observer } from "./observer";

const mockEvent = { type: "click" };
type MockEvent = typeof mockEvent;

describe("eventStream", () => {
  const cb = jest.fn();

  it("should add an observer to a pool with topic on subscribe", () => {
    const stream = eventStream<MockEvent>().subscribe("click", observer(cb));
    expect(stream.pool.has("click")).toEqual(true);
    expect(stream.pool.size).toEqual(1);
  });

  it("should add an another observer to a pool on an existing topic on subscribe", () => {
    const stream = eventStream<MockEvent>().subscribe("click", observer(cb));
    stream.subscribe("click", observer(cb));
    expect(stream.pool.get("click")).toHaveLength(2);
  });

  it("should notify all observers on given topic", () => {
    const topic = "click";
    const stream = eventStream<MockEvent>()
      .subscribe(topic, observer(cb))
      .subscribe(topic, observer(cb));
    stream.notify(topic, mockEvent);
    expect(cb).toBeCalledTimes(stream.pool.get(topic)?.length ?? 0);
  });

  it("should not notify observers on topic they are not subscribed to", () => {
    const stream = eventStream<MockEvent>().subscribe("click", observer(cb));
    stream.notify("move", mockEvent);
    expect(cb).toBeCalledTimes(0);
  });
});

describe("emit", () => {
  const cb = jest.fn();

  it("should notify all observers on given subject on a stream", () => {
    const stream = eventStream<MockEvent>().subscribe("click", observer(cb));
    emit("click", mockEvent, stream);
    expect(cb).toBeCalledTimes(1);
  });
});

describe("eventEmitter", () => {
  const cb = jest.fn();

  it("should notify all observers on a stream subscribed to a given subject", () => {
    const stream = eventStream<MockEvent>().subscribe("click", observer(cb));
    const handler = eventEmitter("click", stream);
    handler(mockEvent);
    expect(cb).toBeCalledTimes(1);
  });
});
