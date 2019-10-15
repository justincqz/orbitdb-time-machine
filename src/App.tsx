import React from 'react';
import { InjectorProvider, DefaultInjector } from './state/dependencyInjector';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './pages/Landing';
import DatabaseView from './pages/Database';
import ErrorPage from './pages/ErrorPage';
import Create from './pages/Create';

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
          <Route exact path='/create'>
            <Create />
          </Route>
          <Route>
            <ErrorPage />
          </Route>
        </Switch>
      </Router>
    </InjectorProvider>
  );
}

export default App;
