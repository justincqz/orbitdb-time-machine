import React from 'react';
import './App.css';
import { StateProvider } from './state/global';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from 'src/pages/Landing';

const App: React.FC = () => {
  return (
    <StateProvider>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
        </Switch>
      </Router>
    </StateProvider>
  );
}

export default App;
