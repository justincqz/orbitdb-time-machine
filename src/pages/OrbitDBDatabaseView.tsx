import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useParams } from "react-router-dom";
import { useDependencyInjector } from "../state/dependencyInjector";
import { D3Data, viewJoinEvent, addUserIdentities } from "../model/D3Data";
import { NodeProvider } from "../providers/NodeProvider";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { Store } from "orbit-db-store";
import databaseStyles from "./OrbitDBDatabaseView.module.css";
import { withRouter } from "react-router-dom";
import OperationsLog from "../providers/OperationsLog";
import JoinEvent from "../model/JoinEvent";
import DAGNode from "../model/DAGNode";
import JoinStorageProvider from "../providers/JoinStorageProvider";
import Sidebar from "../components/viewDatabase/Sidebar";
import OrbitDBStoreDisplay from "../components/OrbitDBStoreDisplay";
import DatabaseUIProvider from "../providers/DatabaseUIProvider";
import EventStoreUI from "../components/databaseUi/EventStoreUI";
import KeyValueUI from "../components/databaseUi/KeyValueUI";

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

  // Limit number of nodes to fetch
  const LIMIT = 10;

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
            loadData();
            if (!listening) {
              setListening(true);
              listenForChanges();
            }
          })
          .catch(e => setError(e.toString()));
      });
    }
  });

  useEffect(() => {
    if (!nodeProvider.current) {
      return;
    }
    if (selectedJoin === null) {
      loadData(true);
    } else {
      nodeProvider.current.getDatabaseGraph().then(node => {
        addUserIdentities(
          viewJoinEvent(
            node.toD3Data(LIMIT),
            storageProvider.current.getJoinEvent(selectedJoin).root
          ),
          nodeProvider.current
        ).then((data) => {
          setD3data(data)
        });
      });
    }
  // For some reason, ESLint thinks loadData should be a dependency
  // eslint-disable-next-line
  }, [selectedJoin]);

  if (store.current != null) {
    switch (store.current._type) {
      case "eventlog":
        uiProvider = new EventStoreUI();
        break;
      case "keyvalue":
        uiProvider = new KeyValueUI();
        break;
      default:
        throw new Error("Unsupported store type");
    }
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
      let childNode = await nodeProvider.current.getDatabaseGraph();
      let d3Node = await addUserIdentities(
        childNode.toD3Data(LIMIT),
        nodeProvider.current
      );
      setD3data(d3Node);
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
        <div className={databaseStyles.titleContainer}>Timeline</div>
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
