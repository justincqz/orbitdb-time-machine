import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useParams } from 'react-router-dom';
import GraphDisplay from '../components/GraphDisplay';
import { useDependencyInjector } from '../state/dependencyInjector';
import { D3Data } from '../model/D3Data';
import { NodeProvider } from "../providers/NodeProvider";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { Store } from "orbit-db-store";
import databaseStyles from './Database.module.css';
import { MdLibraryAdd, MdHome } from 'react-icons/md';
import { withRouter } from 'react-router-dom';

const DatabaseView: React.FC = withRouter(({ history }) => {
  // URL parameters
  let { hash, name }: { hash: string, name: string } = useParams();
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
        }).catch((e) => setError(e.toString()));
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
      return;
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
  }

  const goHome = () => {
    history.push("/");
  }

  if (error) {
    return <div className={databaseStyles.container}>
      <div className={databaseStyles.error}>{error}</div>
    </div>
  }

  if (loading) {
    return <div className={databaseStyles.loadContainer}>
      <h1>Loading...</h1>
    </div>
  }

  return <div>
    <div className={databaseStyles.container}>
      <div className={databaseStyles.addressContainer}>
        Viewing: {`/orbitdb/${hash}/${name}`}
      </div>
      <div className={databaseStyles.titleContainer}>Timeline</div>
      <GraphDisplay inputData={d3data} nodeColour='#7bb1f1ff' lineColour='#1d5495ff' />
      <div className={databaseStyles.iconTaskbarBorder}>
        <div className={databaseStyles.iconTaskbar}>
          <div className={databaseStyles.icon} onClick={goHome}>
            <MdHome size={'6vh'} />
          </div>
          <div className={databaseStyles.icon} onClick={addNode}>
            <MdLibraryAdd size={'6vh'} />
          </div>
        </div>
      </div>
    </div>
  </div>
});

export default DatabaseView;
