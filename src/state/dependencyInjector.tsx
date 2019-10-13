import {DatabaseProvider} from '../utils/DatabaseProvider'
import React, {createContext, useContext} from 'react';
import {OrbitDBProvider} from '../utils/OrbitDBProvider';

// Injector to mock dependencies
export interface Injector {
  createDbProvider(address: string): Promise<DatabaseProvider>;
}

// This injector is used in the main application
export class DefaultInjector implements Injector {
  createDbProvider(address: string): Promise<DatabaseProvider> {
    return OrbitDBProvider.build(address);
  }
}

const InjectorContext: React.Context<Injector> = createContext(null);

// This provides the inejctor
export const InjectorProvider = ({children, injector}: { children: any, injector: Injector }) => {
  return (<InjectorContext.Provider value={injector}>
    {children}
  </InjectorContext.Provider>);
}

export const useDependencyInjector = () => useContext(InjectorContext);
