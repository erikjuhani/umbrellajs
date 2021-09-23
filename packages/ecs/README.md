# @umbrellajs/ecs - Entity Component System
Entity component systems are usually used with game development, where entity holds an identifier
and components, which are then handled by appropriate system definitions.

## Features
*Entity*: An identifier with zero or more components.
*Component*: A representation of simple data or trait.
*System*: A function that runs side-effects on entities with certain components.

## Usage
### Defining components
Components needs to be defined with key of string value and the default value,
which is set when component is created from component definition.

Component definitions are used to get components from entities, used in a query or when defining
component types for systems.

```ts
import { defineComponent } from "@umbrellajs/ecs";

// Component is defined with key "position" and default value { x: 0, y: 0 }
const Position = defineComponent("position", { x: 0, y: 0 });
```

### Creating entities
Entities are created with entity function, which takes in a set of component definitions.
Each component will receive an identifier in an incremental sequence.

```ts
import { entity } from "@umbrellajs/ecs";

// Component definitions
const Position = defineComponent("position", { x: 0, y: 0 });
const Velocity = defineComponent("velocity", { x: 0, y: 0 });

const e = entity(Position, Velocity);
```

### Accessing entity components and mutating data
Entities may or may not have components attached to them.
These components can be accessed through entity method `entity.getComponent`.

Components have a method for mutation `component.assign`, which sets the component data with the given argument.

```ts
// Component definitions
const Position = defineComponent("position", { x: 0, y: 0 });
const Velocity = defineComponent("velocity", { x: 0, y: 0 });

// Entity created with Position component
// pos is { x: 0, y: 0 }
let pos = entity.getComponent(Position);

// vel variable is null as it does not exist in this entity.
const vel = entity.getComponent(Velocity);

// Mutating component data
pos?.assign({ x: 2, y: 2 })

// If position component data is accessed again it will give out an object with updated value { x: 2, y: 2 }.
pos = entity.getComponent(Position);
```

### Creating a system
Systems are functions that have side-effects and usually mutate component data inside entities.
Usually systems are created for specific component definitions.

Systems are created with system creation function that is given a key and a schema with update function logic.
```ts
import { queryEntities, system } from "./system";

// Pool of entities
const pool = [
  entity(Position, Velocity),
  entity(Mass),
  entity(Velocity),
  entity(Position, Mass),
];

// A system for accessing position components of entities.
const positionSystem = system<typeof Position>("position", {
  update: (entities) => {
    entities.forEach((e) => {
      const pos = e.getComponent(Position);
      if (pos) {
        pos.assign({ x: pos.data.x + 1, y: pos.data.y + 1 });
      }
    });
  },
});

// Run position system update function, which mutates each entity with position data
positionSystem.update(pool);
```

### Querying entities
It's more useful to query entites from a pool, than to give all entities for system function.
This is more efficient as usually the system function is only interested in certain types of components.

Here we have the same example as with introducing the creation of systems.
In this example the pool of entities is queried so only the entities that match the query are included.
```ts
import { queryEntities, system } from "./system";

// Pool of entities
const pool = [
  entity(Position, Velocity),
  entity(Mass),
  entity(Velocity),
  entity(Position, Mass),
];

// A system for accessing position components of entities.
const positionSystem = system<typeof Position>("position", {
  update: (entities) => {
    entities.forEach((e) => {
      const pos = e.getComponent(Position);
      if (pos) {
        pos.assign({ x: pos.data.x + 1, y: pos.data.y + 1 });
      }
    });
  },
});

// Holds two entites as only two entities had position component defined
const positionEntities = queryEntities(pool, Position);

// Run position system update function, which mutates each entity with position data
positionSystem.update(positionEntities);
```
