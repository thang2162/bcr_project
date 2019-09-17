import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { Switch, Route, HashRouter } from "react-router-dom";
import "./styles.css";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import AnotherPage from "./pages/AnotherPage";
import SearchResults from "./pages/SearchResults";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Users  from "./pages/Users";
import Account  from "./pages/Account";
import Admin  from "./pages/Admin";
import Cart  from "./pages/Cart";

import { Context, initialState, reducer } from "./store";

const RunOnLoad = () => {
  //alert('run on load');
}

function App() {
  RunOnLoad();
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ store, dispatch }}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/results" component={SearchResults} />
          <Route path="/homepage" component={HomePage} />
          <Route path="/another" component={AnotherPage} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/users" component={Users} />
          <Route path="/account" component={Account} />
          <Route path="/admin" component={Admin} />
          <Route path="/cart" component={Cart} />
        </Switch>
      </HashRouter>
    </Context.Provider>
  );
}
export default App;
