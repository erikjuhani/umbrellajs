export type UseState<State> = () => [State, (newState: State) => void];

export type FunctionType<State> = (
  useState: UseState<State[keyof State]>,
  payload?: any
) => void;

export type ActionsMap<State> = {
  [key in string | keyof State]: { [action: string]: FunctionType<State> };
};

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
  match<Key extends keyof State>(key: Key, value: State[Key]): boolean;
  dispatch: <
    StateKey extends keyof State,
    Action extends keyof Actions[StateKey]
  >(
    args: Parameters<Actions[StateKey][Action]>[1] extends undefined
      ? {
          state: StateKey;
          action: Action;
        }
      : {
          state: StateKey;
          action: Action;
          payload: Parameters<Actions[StateKey][Action]>[1];
        }
  ) => void;
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
    dispatch: ({ state, action, payload }: any) => {
      const fn = machine.actions[state][action];
      if (fn) {
        payload
          ? fn(machine.useState(state), payload)
          : fn(machine.useState(state));
      }
    },
    match: (key, value) => {
      if (typeof value === "object") {
        return JSON.stringify(machine.state[key]) === JSON.stringify(value);
      }
      return machine.state[key] === value;
    },
  };
  return machine;
}
