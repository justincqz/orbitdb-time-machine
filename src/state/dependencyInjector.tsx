import {NodeProvider} from '../providers/NodeProvider'
import React, {createContext, useContext} from 'react';
import {OrbitDBNodeProvider} from '../adapters/OrbitDBNodeProvider';
import {DatabaseProvider} from '../providers/DatabaseProvider';
import OrbitDBProvider from '../adapters/OrbitDBProvider';
import JoinStorageProvider from '../providers/JoinStorageProvider';
import LocalStoreageJoinProvider from '../adapters/LocalStorageJoinProvider';

// Injector to mock dependencies
export interface Injector {
  createNodeProvider(store: any): NodeProvider;
  createDBProvider(): Promise<DatabaseProvider>;
  createJoinStorageProvider(): JoinStorageProvider;
}

// This injector is used in the main application
export class DefaultInjector implements Injector {
  createJoinStorageProvider(): JoinStorageProvider {
    return new LocalStoreageJoinProvider();
  }
  createDBProvider(): Promise<DatabaseProvider> {
    return OrbitDBProvider.build();
  }
  createNodeProvider(dbInstance: any): NodeProvider {
    return new OrbitDBNodeProvider(dbInstance);
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
