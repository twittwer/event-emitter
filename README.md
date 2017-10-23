# event-emitter

> Minimalist EventEmitter with optional EventBuffer

## Installation

`npm install git+ssh://git@github.com:twittwer/event-emitter.git`

## Usage

```javascript
const EventEmitter = require('event-emitter');

const chat = new EventEmitter();

chat.on('message', (username, message) => {
    console.log(`${username}: ${message}`);
});

const joinListener = (username) => {
    console.log(`${username} joined the chat`);
};
chat.on('join', joinListener);

chat.emit('join', 'jSmith');
chat.emit('message', 'jSmith', 'Allons-y');

chat.removeListener('join', joinListener);

chat.emit('join', 'jDoe');
chat.emit('message', 'jDoe', 'Do you know my name?');
```

Result:

```text
jSmith joined the chat 
jSmith: Allons-y 
jDoe: Do you know my name?
```

## Reference

### Methods

#### eventEmitter.on(eventName, eventHandler): void

#### eventEmitter.removeListener(eventName, eventHandler): void

#### eventEmitter.emit(eventName, [...eventArguments]): void

#### eventEmitter.startBuffering(eventName): void

#### eventEmitter.stopBuffering(eventName): void
