import React from 'react';
import { StateProvider } from './state/global';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './pages/Landing';
import DatabaseView from './pages/Database';

const App: React.FC = () => {
  return (
    <StateProvider>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
          <Route exact path='/orbitdb/:hash/:name'>
            <DatabaseView />
          </Route>
        </Switch>
      </Router>
    </StateProvider>
  );
}

export default App;
