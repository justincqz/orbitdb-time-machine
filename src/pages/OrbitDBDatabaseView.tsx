import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useParams } from "react-router-dom";
import { useDependencyInjector } from "../state/dependencyInjector";
import { D3Data, viewJoinEvent, addUserIdentities } from "../model/D3Data";
import { NodeProvider } from "../providers/NodeProvider";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { Store } from "orbit-db-store";
import databaseStyles from './OrbitDBDatabaseView.module.css';
import { withRouter } from 'react-router-dom';
import OperationsLog from '../providers/OperationsLog';
import JoinEvent from '../model/JoinEvent';
import DAGNode from '../model/DAGNode';
import JoinStorageProvider from '../providers/JoinStorageProvider';
import Sidebar from '../components/viewDatabase/Sidebar';
import OrbitDBStoreDisplay from '../components/OrbitDBStoreDisplay';
import DatabaseUIProvider from '../providers/DatabaseUIProvider';
import EventStoreUI from '../components/databaseUi/EventStoreUI';
import KeyValueUI from '../components/databaseUi/KeyValueUI';
import DocStoreUI from "../components/databaseUi/DocStoreUI";
import OrbitDBDatabaseTypes from "../adapters/OrbitDBDatabaseTypes";
import CounterStoreUI from "../components/databaseUi/CounterStoreUI";
import FeedStoreUI from "../components/databaseUi/FeedStoreUI";

/**
 * Implements the shared elements of database views.
 * Checks the type of store being visualised and renders the
 * corresponding component.
 */
const OrbitDBDatabaseView: React.FC = withRouter(({ history }) => {
  // URL parameters
  let { hash, name }: { hash: string; name: string } = useParams();
  const injector = useDependencyInjector();
  let nodeProvider: MutableRefObject<NodeProvider> = useRef(null);
  let store: MutableRefObject<Store> = useRef(null);
  let dbProvider: MutableRefObject<DatabaseProvider> = useRef(null);
  let storageProvider: MutableRefObject<JoinStorageProvider> = useRef(
    undefined
  );
  let uiProvider: DatabaseUIProvider;

  // For display nodes limiting.
  let [nodeLimit, setNodeLimit]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(10);

  const [loading, setLoading] = useState(true);
  const [d3data, setD3data]: [
    D3Data,
    React.Dispatch<React.SetStateAction<D3Data>>
  ] = useState(null);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [selectedJoin, setSelectedJoin]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState(null);

  useEffect(() => {
    if (storageProvider.current === undefined) {
      storageProvider.current = injector.createJoinStorageProvider();
      storageProvider.current.setDatabase(`${hash}/${name}`);
    }

    if (!dbProvider.current) {
      injector.createDBProvider().then(provider => {
        dbProvider.current = provider;
        dbProvider.current
          .openDatabase(`/orbitdb/${hash}/${name}`)
          .then((s: Store) => {
            store.current = s;
            nodeProvider.current = injector.createNodeProvider(
              s,
              dbProvider.current
            );

            dbProvider.current.openDatabase(storageProvider.current.getStorageAddress())
              .then((storage: Store) => {
                  storageProvider.current.connectToStorage(storage);
                  storageProvider.current.setUser(s._oplog._identity._id);
                  if (!listening) {
                    setListening(true);
                    listenForChanges();
                  }
                  loadData();
                })
              .catch(_ => {
                console.log("Saving in local storage...");
                storageProvider.current = injector.createLocalJoinStorageProvider();
                storageProvider.current.setDatabase(`${hash}/${name}`);
                if (!listening) {
                  setListening(true);
                  listenForChanges();
                }
                loadData();
              })
          })
          .catch(e => setError(e.toString()));
      });
    }
  });

  // This sets or re-sets (using loadData) the d3graph based on selectedJoin
  useEffect(() => {
    // Make sure this only gets run after we have initialised dependencies
    if (!nodeProvider.current) {
      return;
    }
    if (selectedJoin === null) {
      loadData(true);
    } else {
      nodeProvider.current.getDatabaseGraph(nodeLimit).then(nodes => {
        nodes.reduce(async (rootNode, node) => {
          (await rootNode).children.push(await addUserIdentities(
            viewJoinEvent(
              node.toD3Data(),
              storageProvider.current.getJoinEvent(selectedJoin).root
            ),
            nodeProvider.current
          ));
          return rootNode;
        }, Promise.resolve({id: "ROOT", children: [], payload: {}}))
          .then((d3data) => {
            // Remove ROOT node if there is only a single root
            d3data = d3data.children.length === 1 ? d3data.children[0] : d3data;
            setD3data(d3data);
        });
      });
    }
    // For some reason, ESLint thinks loadData should be a dependency
    // eslint-disable-next-line
  }, [selectedJoin]);

  if (store.current != null) {
    switch (store.current._type) {
      case OrbitDBDatabaseTypes.EventStore:
        uiProvider = new EventStoreUI();
        break;
      case OrbitDBDatabaseTypes.KeyValueStore:
        uiProvider = new KeyValueUI();
        break;
      case OrbitDBDatabaseTypes.DocumentStore:
        uiProvider = new DocStoreUI();
        break;
      case OrbitDBDatabaseTypes.CounterStore:
        uiProvider = new CounterStoreUI();
        break;
      case OrbitDBDatabaseTypes.FeedStore:
        uiProvider = new FeedStoreUI();
        break;
      default:
        throw new Error("Unsupported store type");
    }
  }

  function handleLimitFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loadData(true);
  }

  function listenForChanges() {
    console.log("listening");
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

  function handleLimitInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value);
    if (!isNaN(parsed)) {
      setNodeLimit(parsed);
    }
  }

  // Prevent backspaces to prevent NaN inputs
  function handleLimitInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e && e.keyCode === 8) {
        e.preventDefault();
    }
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
    if ((d3data !== null && !forceLoad) || error !== "") {
      return;
    }
    setLoading(true);
    try {
      let childNodes = await nodeProvider.current.getDatabaseGraph(nodeLimit);
      let d3data = await childNodes.reduce(async (rootNode, node) => {
        (await rootNode).children.push(await addUserIdentities(
            node.toD3Data(),
          nodeProvider.current
        ));
        return rootNode;
      }, Promise.resolve({id: "ROOT", children: [], payload: {}}));
      // Remove ROOT node if there is only a single root
      d3data = d3data.children.length === 1 ? d3data.children[0] : d3data;
      setD3data(d3data);
    } catch (e) {
      setError(e.toString());
      throw e;
    } finally {
      setLoading(false);
    }
  }

  const goHome = () => {
    history.push("/");
  };

  if (error) {
    return (
      <div className={databaseStyles.container}>
        <div className={databaseStyles.error}>{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={databaseStyles.loadContainer}>
        <span className={databaseStyles.loadTitle}>Loading database</span>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={databaseStyles.splitView}>
      <Sidebar
        joinEvents={storageProvider.current.getJoins()}
        selectJoin={setSelectedJoin}
        type={store.current._type}
        store={store.current}
        uiProvider={uiProvider}
        goHome={goHome}
      />
      <div className={databaseStyles.container}>
        <div className={databaseStyles.addressContainer}>
          Viewing: {`/orbitdb/${hash}/${name}`}
        </div>
        <div className={databaseStyles.numNodesContainer}>
          Display Limit:
          <form
            onSubmit={handleLimitFormSubmit}
          >
            <input
              type="text"
              pattern="[0-9]*"
              title="Please only input numbers."
              onChange={handleLimitInputChange}
              onKeyDown={handleLimitInputKeyDown}
              value={nodeLimit}
            />
          </form>
        </div>
        <OrbitDBStoreDisplay
          operationLogData={
            d3data
          }
          nodeProvider={nodeProvider.current}
          dbProvider={dbProvider.current}
          uiProvider={uiProvider}
        />
      </div>
    </div>
  );
});

export default OrbitDBDatabaseView;
