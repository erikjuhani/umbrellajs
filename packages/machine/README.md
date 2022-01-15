# @umbrellajs/machine - State Machine

State Machine's are usually used to mutate data by state change and transition.
This implementation of State Machine tries to be as minimal and easy to use as possible
with data storage capabilities.

## Features

Machine: A stateful machine that can store data and mutate it with actions

## Usage

### Creating a stateful machine

To create a machine, you will first need to define a schema that the state machine will follow.

As an example let's define a schema for lightswitch with two states `On` and `Off` and an
action to change the state.

```ts
enum State {
  Off,
  On,
}

const schema = {
  // Initial state
  state: {
    light: State.Off,
  }

  // Actions that can mutate the state
  actions: {
    // We use the key of the state to define dictionary of actions for that particular state
    light: {
      // First parameter is a hook-like function that returns the current
      // state and a setState function for state mutation
      // Second parameter is for payload if we want to provide external data to
      // decide what the next state should be.
      switch: (useState) => {
        // state variable holds current state `{ light: State.Off }`
        const [state, setState] = useState();

        // Reverses the current state simulates a lightswitch
        // enum State is either 0 or 1
        const nextState = Number(!state); // nextState is 1 == State.On;
        setState(nextState) // State mutation
      }
    }
  }
};

// We give the schema as a paramter to `createMachine` function in order to initialize a state machine.
const machine = createMachine(schema);

machine.state // returns the current state;
```

Note: Machines can be created with multiple states and multiple actions.

### Dispatching state changes

In order for the machine to mutate state, we need to call a `dispatch` function to arrange a state change.

We use the previous lightswitch machine for this purpose to demonstrate.

```ts
// machine is created above

machine.state.light; // -> State.Off

// State argument of the dispatch function determines the state key we want to mutate.
// Thanks to typescript we get inferred types and type safety.
// For example we cannot use non existing state actions.
machine.dispatch({ state: "light", action: "nope" }); // TypeError

// Or trying to give a payload for function that is not defined in the schema.
machine.dispatch({ state: "light", action: "switch", payload: 1 }); // TypeError

// Action argument defines the action we want to run to mutate state. In this particular case `switch`.
// We do not provide a payload as according to the machine schema the action `switch` does not use a payload for state mutation.
machine.dispatch({ state: "light", action: "switch" }); // Mutates state.

// If we would have defined a payload in the schema we would add a payload attribute to given dispatch object.
machine.dispatch({ state: "light", action: "switch", payload: 1 });

machine.state.light; // -> State.On
```
