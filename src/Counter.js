import React, { useContext } from "react";
import { Context } from "./store";

export default () => {
  const { store, dispatch } = useContext(Context);
  return (
    <div className="counter">
      <p>You clicked {store.count} times</p>
      <div>
        <button
          className="minus"
          onClick={() => dispatch({ type: "decrement" })}
        >
          -
        </button>
        <button onClick={() => dispatch({ type: "reset" })}>RESET</button>
        <button
          className="plus"
          onClick={() => dispatch({ type: "increment" })}
        >
          +
        </button>
      </div>
    </div>
  );
};
