## super-context

super-context is a lightweight library that simplifies the usage of React's Context API by providing a convenient way to manage and propagate changes to a shared state. **It solves the issue of unnecessary re-renders** commonly associated with the default context implementation by utilizing refs, setters, getters, and subscribers.

### Installation

Install the package using npm:

```shell
npm install super-context
```

or with yarn:

```shell
yarn add super-context
```

### Usage

#### Creating a Super Context

To create a super context, use the `createSuperContext` function. It takes an initial state as an argument and returns a set of hooks and components for managing and accessing the state.

```jsx
import { createSuperContext } from 'super-context';

// Define the initial state
const initialState = {
  // Your initial state properties here
};

// Create the super context
const { Provider, useStore } = createSuperContext(initialState);
```

#### Providing the Super Context

Wrap your application or a specific part of your application with the `Provider` component to make the super context available to child components.

```jsx
<Provider>
  {/* Your application or component tree */}
</Provider>
```

#### Consuming the Super Context

To access the state and update it within a component, use the `useStore` hook. It returns an array with three items: the state selection, a setter for the entire store, and an object of setters based on the items included in the initialState.

```jsx
const MyComponent = () => {
  const [stateSelection, setStore, setters] = useStore();

  // Use the selected state and setters as needed

  return (
    {/* JSX for your component */}
  );
};
```

#### Updating the State

To update the state, use the `setStore` function provided by the `useStore` hook. It accepts either a partial state object or a function that takes the previous state and returns a new state.

```jsx
setStore({
  // Partial state updates here
});

// or

setStore((prevState) => {
  // Calculate and return a new state based on the previous state
});
```

#### Setters

The `setters` object returned by the `useStore` hook provides individual setter functions for each property of the state. These setter functions allow you to update specific properties of the state directly.

```jsx
setters.setProperty1(newValue);

// Example:
setters.setCounter(counter + 1);

// Example with prev state
setters.setCounter((counter) => counter + 1);
```

#### Error Handling

If the super context is not found within a component that tries to consume it, an error will be thrown. Make sure to wrap your components that depend on the super context with the `Provider` component.

### Features

- Efficient state management using refs, setters, getters, and subscribers
- Prevents unnecessary re-renders by propagating changes only to subscribed components
- Simplifies the usage of React's Context API with a clean and intuitive API

### Examples

Here's an example demonstrating how to use super-context:

```jsx
import React from 'react';
import { createSuperContext } from 'super-context';

const initialState = {
  counter: 0,
  // Add more properties as needed
};

const { Provider, useStore } = createSuperContext(initialState);

const CounterDisplay = () => {
  const [counter] = useStore((store) => store.counter);

  return <div>Counter: {counter}</div>;
};

const CounterButtons = () => {
  const [, setStore, setters] = useStore();

  const increment = () => {
    setStore((prevStore) => ({ ...prevStore, counter:

 prevStore.counter + 1 }));
  };

  const decrement = () => {
    setStore((prevStore) => ({ ...prevStore, counter: prevStore.counter - 1 }));
  };

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <CounterDisplay />
      <CounterButtons />
    </Provider>
  );
};

export default App;
```

Feel free to modify the example code to suit your specific use case. Enjoy using super-context!