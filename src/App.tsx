import React from 'react';
import { InjectorProvider, DefaultInjector } from './state/dependencyInjector';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './pages/Landing';
import ErrorPage from './pages/ErrorPage';
import Create from './pages/Create';
import OrbitDBDatabaseView from './pages/OrbitDBDatabaseView';

const App: React.FC = () => {
  return (
    <InjectorProvider injector={new DefaultInjector()}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
          <Route exact path='/orbitdb/:hash/:name'>
            <OrbitDBDatabaseView />
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
