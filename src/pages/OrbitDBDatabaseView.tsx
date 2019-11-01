import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useParams } from 'react-router-dom';
import { useDependencyInjector } from '../state/dependencyInjector';
import { D3Data, viewJoinEvent } from '../model/D3Data';
import { NodeProvider } from "../providers/NodeProvider";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { Store } from "orbit-db-store";
import databaseStyles from './OrbitDBDatabaseView.module.css';
import { withRouter } from 'react-router-dom';
import OperationsLog from '../providers/OperationsLog';
import JoinEvent from '../model/JoinEvent';
import DAGNode from '../model/DAGNode';
import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinList from '../components/JoinList';
import OrbitDBEventStoreDisplay from '../components/OrbitDBEventStoreDisplay';
import OrbitDBDatabaseTypes from '../adapters/OrbitDBDatabaseTypes';

/**
 * Implements the shared elements of database views.
 * Checks the type of store being visualised and renders the
 * corresponding component.
 */
const OrbitDBDatabaseView: React.FC = withRouter(({ history }) => {
  // URL parameters
  let { hash, name }: { hash: string, name: string } = useParams();
  const injector = useDependencyInjector();
  let nodeProvider: MutableRefObject<NodeProvider> = useRef(null);
  let store: MutableRefObject<Store> = useRef(null);
  let dbProvider: MutableRefObject<DatabaseProvider> = useRef(null);
  let storageProvider: MutableRefObject<JoinStorageProvider> = useRef(undefined);

  // Limit number of nodes to fetch
  const LIMIT = 10;

  const [loading, setLoading] = useState(true);
  const [d3data, setD3data]: [D3Data, React.Dispatch<React.SetStateAction<D3Data>>] = useState(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [selectedJoin, setSelectedJoin]: [string, React.Dispatch<React.SetStateAction<string>>] = useState(null);

  let storeDisplayRenderMap = generateRenderMap();

  /**
   * Generates and returns a mapping between every OrbitDBDatabaseType 
   * and it's corresponding component's render function.
   */
  function generateRenderMap(): Object {
    let result = {};

    result[OrbitDBDatabaseTypes.EventStore] = renderEventStoreDisplay;

    return result;
  }

  /**
   * Returns the component to render if visualising an EventStore.
   */
  function renderEventStoreDisplay() {
    return (
      <OrbitDBEventStoreDisplay 
        operationLogData={
          selectedJoin === null ? d3data : viewJoinEvent(d3data, storageProvider.current.getJoinEvent(selectedJoin).root)
        }
        eventStore={store.current}
        dbProvider={dbProvider.current}
      />
    );
  }

  useEffect(() => {
    if (storageProvider.current === undefined) {
      storageProvider.current = injector.createJoinStorageProvider();
      storageProvider.current.setDatabase(`${hash}/${name}`);
    }

    if (!dbProvider.current) {
      injector.createDBProvider().then((provider) => {
        dbProvider.current = provider;
        dbProvider.current.openDatabase(`/orbitdb/${hash}/${name}`).then((s: Store) => {
          store.current = s;
          nodeProvider.current = injector.createNodeProvider(s, dbProvider.current);
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

      recordJoinEvent(nodeProvider.current.getOperationsLog());

      loadData(true);

    });

    // Re-query database if any local writes occurred.
    nodeProvider.current.listenForLocalWrites(() => {
      console.log("Local write recorded!");
      loadData(true);
    });
  }

  function recordJoinEvent(newLog: OperationsLog) {
    // Finds the earliest split node and returns a tree with it as root.
    let D3DAG: D3Data = DAGNode.saveHeadsAsD3Data(newLog.getHeads());

    // Ignoring straight forward joins that don't result in splits.
    if (D3DAG != null) {
      let newJoinEvent = new JoinEvent(D3DAG);
      storageProvider.current.addJoinEvent(newJoinEvent);
    }
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

  if (error) {
    return <div className={databaseStyles.container}>
      <div className={databaseStyles.error}>{error}</div>
    </div>
  }

  if (loading) {
    return <div className={databaseStyles.loadContainer}>
      <span className={databaseStyles.loadTitle}>Loading database</span>
      <div>Loading...</div>
    </div>
  }

  if (storeDisplayRenderMap[store.current.type] == null) {
    console.log(`Asked to render unsupported database type: ${store.current.type}`);
    return null;
  }

  return <div className={databaseStyles.splitView}>
    <JoinList
      joinEvents={storageProvider.current.getJoins()}
      selectJoin={setSelectedJoin}
    ></JoinList>
    <div className={databaseStyles.container}>
      <div className={databaseStyles.addressContainer}>
        Viewing: {`/orbitdb/${hash}/${name}`}
      </div>
      <div className={databaseStyles.titleContainer}>Timeline</div>
      {storeDisplayRenderMap[store.current.type]()}
    </div>
  </div>
});

export default OrbitDBDatabaseView;
