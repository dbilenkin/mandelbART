import React from "react";
import { HashRouter as Router, Route, NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

import Home from "./components/Home";
import Gallery from "./components/Gallery";
import About from "./components/About";

const App = () => (
  <Router>
    <div>
      <div className={`app-600`}>
        <Menu text>
          <Menu.Item header>MandelbART</Menu.Item>
          <Menu.Item
            as={NavLink}
            to="/home/-2/-1/1"
            children="Home"
            activeClassName="active"
          />
          <Menu.Item
            as={NavLink}
            to="/gallery"
            children="Gallery"
            activeClassName="active"
          />
          <Menu.Item
            as={NavLink}
            to="/about"
            children="About"
            activeClassName="active"
          />
        </Menu>
      </div>
      <div>
        <Route
          path="/home/:left?/:top?/:zoom?/:iterations?/:colors?/:colorSmooth?"
          component={Home}
        />
        <Route path="/gallery" component={Gallery} />
        <Route path="/about" component={About} />
        <Route exact path="/" component={Home} />
      </div>
    </div>
  </Router>
);

export default App;
