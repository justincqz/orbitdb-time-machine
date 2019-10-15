import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import GraphDisplay from '../components/GraphDisplay';
import {useDependencyInjector} from '../state/dependencyInjector';
import {D3Data} from '../model/D3Data';
import {NodeProvider} from "../providers/NodeProvider";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { Store } from "orbit-db-store";
import databaseStyles from './Database.module.css';
import { MdLibraryAdd } from 'react-icons/md';

const DatabaseView: React.FC = () => {
  // URL parameters
  let {hash, name}: { hash: string, name: string } = useParams();
  const injector = useDependencyInjector();
  let nodeProvider: NodeProvider;
  let store: Store;
  let dbProvider: DatabaseProvider;
  // Limit number of nodes to fetch
  const LIMIT = 10;

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true);
  const [d3data, setD3data]: [D3Data, React.Dispatch<React.SetStateAction<D3Data>>] = useState(null);
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('');

  useEffect(() => {
    if (!dbProvider) {
      injector.createDBProvider().then((provider) => {
        dbProvider = provider;
        dbProvider.openDatabase(`/orbitdb/${hash}/${name}`).then((s) => {
          store = s;
          nodeProvider = injector.createNodeProvider(store);
          loadData();
        });
      });
    }
  });

  async function loadData(): Promise<void> {
    // Check whether we've already fetched the data. In the future, maybe diff?
    if (d3data !== null || error !== '') {
      return
    }
    setLoading(true);
    try {
      let childNode = await nodeProvider.getDatabaseGraph();
      console.log(childNode.toD3Data(LIMIT));
      setD3data(childNode.toD3Data(LIMIT));
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  async function addNode() {
    await store.add('testvalue');
    console.log('added');
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div className={databaseStyles.container}>
    <div className={databaseStyles.addButton} onClick={addNode}>
      <MdLibraryAdd size={'3em'} />
    </div>
    Viewing: {`orbitdb/${hash}/${name}`}
    <GraphDisplay inputData={d3data}/>
  </div>
}

export default DatabaseView;
