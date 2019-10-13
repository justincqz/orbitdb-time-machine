import React from 'react';
import './App.css';
import { StateProvider } from './state/global';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from 'src/pages/Landing';
import GraphDisplay from './components/GraphDisplay';

const App: React.FC = () => {
  return (
    <StateProvider>
      <Router>
        <Switch>
          <Route exact path='/'>
            <GraphDisplay />
          </Route>
        </Switch>
      </Router>
    </StateProvider>
  );
}

export default App;
