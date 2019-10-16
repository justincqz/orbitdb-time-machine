import React, {useEffect, useState, useRef, MutableRefObject} from 'react';
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
  let nodeProvider: MutableRefObject<NodeProvider> = useRef(null);
  let store: MutableRefObject<Store> = useRef(null);
  let dbProvider: MutableRefObject<DatabaseProvider> = useRef(null);
  
  // Limit number of nodes to fetch
  const LIMIT = 10;

  const [loading, setLoading] = useState(true);
  const [d3data, setD3data]: [D3Data, React.Dispatch<React.SetStateAction<D3Data>>] = useState(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!dbProvider.current) {
      injector.createDBProvider().then((provider) => {
        dbProvider.current = provider;
        dbProvider.current.openDatabase(`/orbitdb/${hash}/${name}`).then((s: Store) => {
          store.current = s;
          nodeProvider.current = injector.createNodeProvider(s);
          loadData();
          if (!listening) {
            setListening(true);
            listenForChanges();
          }
        });
      });
    }
  });

  function listenForChanges() {
    console.log('listening')
    nodeProvider.current.listenForDatabaseGraph(() => {
      loadData(true);
    });
  }

  async function loadData(forceLoad: boolean = false): Promise<void> {
    // Check whether we've already fetched the data. In the future, maybe diff?
    if ((d3data !== null && !forceLoad) || error !== '') {
      return
    }
    setLoading(true);
    try {
      let childNode = await nodeProvider.current.getDatabaseGraph();
      console.log(childNode.toD3Data(LIMIT));
      setD3data(childNode.toD3Data(LIMIT));
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  async function addNode() {
    let value = prompt('Enter a value to insert:');

    if (value === null || value === '') {
      return;
    }

    try {
      await store.current.add(value);
    } catch (e) {
      setError(e.toString());
    }
    loadData(true);
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
