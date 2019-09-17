import React from "react";
import { Link } from "react-router-dom";
import Counter from "../Counter";

export default () => (
  <>
    <header>
      <h1>Another Page</h1>
      <Link to="/">Home</Link>
    </header>
    <section>
      <Counter />
    </section>
  </>
);
