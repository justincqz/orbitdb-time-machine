import React from 'react';
import { InjectorProvider, DefaultInjector } from './state/dependencyInjector';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './pages/Landing';
import DatabaseView from './pages/Database';

const App: React.FC = () => {
  return (
    <InjectorProvider injector={new DefaultInjector()}>
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
    </InjectorProvider>
  );
}

export default App;
