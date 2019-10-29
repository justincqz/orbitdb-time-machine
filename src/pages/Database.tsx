import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useParams } from 'react-router-dom';
import GraphDisplay from '../components/GraphDisplay';
import { useDependencyInjector } from '../state/dependencyInjector';
import { D3Data, viewJoinEvent } from '../model/D3Data';
import { NodeProvider } from "../providers/NodeProvider";
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { Store } from "orbit-db-store";
import databaseStyles from './Database.module.css';
import { MdLibraryAdd, MdHome } from 'react-icons/md';
import { withRouter } from 'react-router-dom';
import OperationsLog from '../providers/OperationsLog';
import JoinEvent from '../model/JoinEvent';
import DAGNode from '../model/DAGNode';
import JoinStorageProvider from '../providers/JoinStorageProvider';
import JoinList from '../components/JoinList';
import Popup from "reactjs-popup";
import DatabaseStateDisplay from "../components/DatabaseStateDisplay";

const DatabaseView: React.FC = withRouter(({ history }) => {
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

  const [databaseState, setDatabaseState] = useState({
    data: [],
    openPopup: false
  });

  useEffect(() => {
    if (storageProvider.current === undefined) {
      storageProvider.current = injector.createJoinStorageProvider();
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

  function setSelectedDatabase(hash: string) {
    try {
      nodeProvider.current.getNodeInfoFromHash(hash).then((nodeEntry) => {
        dbProvider.current.constructOperationsLogFromEntries([nodeEntry]).then((operationsLog) => {
          let reconstructedData = nodeProvider.current.reconstructData(operationsLog);

          // Populate data to visualise in table.
          let filteredData = reconstructedData.map((data) => {
            return {"value" : data.payload.value};
          });

          setDatabaseState({
            ...databaseState,
            data: filteredData.reverse(),
            openPopup: true
          });
        });
      });
    } catch (e) {
      // TODO: Error handling.
      console.log("Something went terribly wrong...");
    }
  }

  function listenForChanges() {
    console.log('listening')
    nodeProvider.current.listenForDatabaseGraph(() => {

      recordJoinEvent(nodeProvider.current.getOperationsLog());

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
      <span className={databaseStyles.loadTitle}>Loading database</span>
      <div>Loading...</div>
    </div>
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
      <GraphDisplay
        nodeProvider={nodeProvider.current}
        inputData={selectedJoin === null ? d3data :
          viewJoinEvent(d3data, storageProvider.current.getJoinEvent(selectedJoin).root)
        }
        nodeColour='#7bb1f1ff'
        lineColour='#1d5495ff'
        setCurrentDatabaseState={setSelectedDatabase}
      />
      <Popup open={databaseState.openPopup}
             onClose={() => setDatabaseState({...databaseState, openPopup: false})}
             position="bottom center">
        <div>
        <DatabaseStateDisplay data={databaseState.data}/>
        </div>
      </Popup>
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
