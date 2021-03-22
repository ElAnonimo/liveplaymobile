import React, { Fragment } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import Configs from "./components/Configs";
import AddConfig from "./components/AddConfig";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Switch>
            <Route exact path="/" component={Configs} />
            <Route path="/add" component={AddConfig} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
