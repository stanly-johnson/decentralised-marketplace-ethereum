import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Components/Home'

function App() {
  return (
    <BrowserRouter>
      <main className="container">
          <Switch>
            <Route path="/" component={Home} />
            <Redirect to="/404" />
          </Switch>
        </main>
    </BrowserRouter>
  );
}

export default App;
