import { createMachine } from "./machine";

describe("createMachine", () => {
  enum SwitchState {
    Off,
    On,
  }

  const initialState = { switch: SwitchState.Off };

  it("should create a machine without actions", () => {
    const schema = {
      state: initialState,
      actions: {},
    };
    const machine = createMachine(schema);
    expect(Object.keys(machine.actions)).toHaveLength(0);
  });

  it("should create a machine with actions", () => {
    const schema = {
      state: initialState,
      actions: {
        switch: {
          press: () => {},
        },
      },
    };
    const machine = createMachine(schema);
    expect(Object.keys(machine.actions)).toHaveLength(1);
  });

  it("should change state with state changing action", () => {
    const machine = createMachine({
      state: initialState,
      actions: {
        switch: {
          press: (_, useState) => {
            const [state, setState] = useState();
            setState(Number(!state));
          },
        },
      },
    });

    expect(machine.state.switch).toEqual(SwitchState.Off);
    machine.dispatch({ state: "switch", action: "press", payload: undefined });
    expect(machine.state.switch).toEqual(SwitchState.On);
    machine.dispatch({ state: "switch", action: "press", payload: undefined });
    expect(machine.state.switch).toEqual(SwitchState.Off);
  });

  it("should match state correctly with match function", () => {
    const machine = createMachine({
      state: initialState,
      actions: {
        switch: {
          press: (_, useState) => {
            const [state, setState] = useState();
            setState(Number(!state));
          },
        },
      },
    });

    expect(machine.match("switch", SwitchState.Off)).toBeTruthy();
    machine.dispatch({ state: "switch", action: "press", payload: undefined });
    expect(machine.match("switch", SwitchState.On)).toBeTruthy();
  });

  it("should match complex state correctly with match function", () => {
    const machine = createMachine({
      state: {
        weather: {
          humidity: 40,
          temperature: 27,
          station: {
            name: "unknown",
            location: "somewhere",
          },
        },
      },
      actions: {
        weather: {
          changeStation: (
            station: { name: string; location: string },
            useState
          ) => {
            const [state, setState] = useState();
            setState({ ...state, station });
          },
        },
      },
    });

    machine.dispatch({
      state: "weather",
      action: "changeStation",
      payload: { name: "hello", location: "world" },
    });

    expect(machine.match("weather", machine.state.weather)).toBeTruthy();
    const nextStation = { name: "next", location: "anywhere" };
    expect(
      machine.match("weather", {
        ...machine.state.weather,
        station: nextStation,
      })
    ).toEqual(false);
    machine.dispatch({
      state: "weather",
      action: "changeStation",
      payload: nextStation,
    });
    expect(
      machine.match("weather", {
        ...machine.state.weather,
        station: nextStation,
      })
    ).toBeTruthy();
  });

  it("should support multiple states with actions", () => {
    enum Brand {
      Lumen = "lumen",
      Generic = "generic",
    }

    const machine = createMachine({
      state: { ...initialState, brand: Brand.Generic },
      actions: {
        switch: {
          press: (_, useState) => {
            const [state, setState] = useState();
            setState(Number(!state));
          },
        },
        brand: {
          setBrand: (brand: Brand, useState) => {
            const [_, setState] = useState();
            setState(brand);
          },
        },
      },
    });

    expect(machine.state.switch).toEqual(SwitchState.Off);
    expect(machine.state.brand).toEqual(Brand.Generic);
    machine.dispatch({ state: "switch", action: "press", payload: undefined });
    machine.dispatch({
      state: "brand",
      action: "setBrand",
      payload: Brand.Lumen,
    });
    expect(machine.state.switch).toEqual(SwitchState.On);
    expect(machine.state.brand).toEqual(Brand.Lumen);
  });
});
