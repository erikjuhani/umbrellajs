# @umbrellajs/event-stream - Event Stream

Event streams are useful, when handling data from events as it will funnel through to
all interested parties. In these demonstrations I will be using browser events for mouse movement.

## Features

_Observer_: A listener / observer function that eventually will handle event from stream.
_EventStream_: An event stream that passes events to correct observers.
_EventEmitter_: An emitter that will send events to a stream.

## Usage

### Defining an observer

Observers are simple high order functions that will run a callback / logic, when called.

```ts
import { observer } from "@umbrellajs/event-stream";

// Browser mouse event
observer<MouseEvent>((event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  console.log("MousePosition:", { mouseX, mouseY });
});

// Custom event
observer<{ lightSwitch: 0 | 1 }>((event) => {
  console.log("LightSwitchValue:", event.lightSwitch);
});
```

### Defining an event stream and subscribing

Event streams are created with `eventStream` creation fuction.

To subscribe an observer to a stream, one can use the `subscribe` method of the stream.

```ts
import { eventStream, observer } from "@umbrellajs/event-stream";

// New stream for mouse events
const mouseStream = eventStream<MouseEvent>();

// Mouse move observer
const mouseMoveObserver = observer<MouseEvent>((event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  console.log("MousePosition:", { mouseX, mouseY });
});

// Subscribing observer to topic
// Mouse move observer will now receive events with topic "mouse/move", when emitted to stream.
mouseStream.subscribe("mouse/move", mouseMoveObserver);
```

### Sending events with eventEmitter

Event emitter can be used, when a lot of same type of events need to be sent.
For example with a case of wanting to send all mouse move events to a stream.

```ts
import { eventStream, observer, eventEmitter } from "@umbrellajs/event-stream";

// New stream for mouse events
const mouseStream = eventStream<MouseEvent>();

// Mouse move observer
const mouseMoveObserver = observer<MouseEvent>((event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  console.log("MousePosition:", { mouseX, mouseY });
});

// Subscribing observer to topic
// Mouse move observer will now receive events with topic "mouse/move", when emitted to stream.
mouseStream.subscribe("mouse/move", mouseMoveObserver);

// Setting event emitter to window to listen for mouse move events
// Now each time the mouse moves inside the window a mouse event is emitted to the mouse stream.
window.onmousemove = eventEmitter("mouse/move", mouseStream);
```
