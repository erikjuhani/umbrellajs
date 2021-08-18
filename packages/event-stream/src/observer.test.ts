import { observer } from "./observer";

describe("Observer", () => {
  const mockEvent = { type: "click" };
  it("should listen to an event", () => {
    const cb = jest.fn();
    const o = observer<typeof mockEvent>(cb);
    o(mockEvent);
    expect(cb).toHaveBeenCalledWith(mockEvent);
  });
});
