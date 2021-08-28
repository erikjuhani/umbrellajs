export type UseState<State> = () => [State, (newState: State) => void];

export type FunctionType<State> = (
  payload: any,
  useState: UseState<State>
) => void;

export type FunctionMap<State> = {
  [action: string]: FunctionType<State>;
};

export type ActionsMap<State> = { [K in keyof State]?: FunctionMap<State[K]> };

export type Schema<State extends object, Actions extends ActionsMap<State>> = {
  state: { [key in keyof State]: State[key] };
  actions: Actions;
};

export interface Machine<State, Actions extends ActionsMap<State>> {
  state: State;
  useState: (
    key: keyof State
  ) => () => [State[typeof key], (state: State[typeof key]) => void];
  actions: Actions;
  dispatch: <
    StateKey extends keyof State,
    Action extends keyof Actions[StateKey]
  >(args: {
    state: StateKey;
    action: Action;
    payload: Parameters<Actions[StateKey][Action]>[0];
  }) => void;
}

export function createMachine<
  State extends object,
  Actions extends ActionsMap<State>
>(schema: Schema<State, Actions>) {
  const machine: Machine<State, Actions> = {
    state: { ...schema.state },
    actions: schema.actions,
    useState: (key) => () =>
      [
        machine.state[key],
        (newState) => (machine.state = { ...machine.state, [key]: newState }),
      ],
    dispatch: ({ state, action, payload }) => {
      const fn = machine.actions[state][action];
      fn && fn(payload, machine.useState(state));
    },
  };
  return machine;
}

export type HandlerFunc<State> = (
  payload: any,
  useState: UseState<State>
) => void;
