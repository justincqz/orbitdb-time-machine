import React, { useState, MutableRefObject, useRef } from "react";
import { useDependencyInjector } from "../state/dependencyInjector";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { Store } from "orbit-db-store";
import { withRouter } from 'react-router-dom';
import CreateFormStyles from './CreateDBForm.module.css';
import { IoMdHand } from "react-icons/io";

const CreateDbForm: React.FC = withRouter(({ history }) => {
  const [name, setName] = useState("");
  const injector = useDependencyInjector();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let dbProvider: MutableRefObject<DatabaseProvider> = useRef(null);
  let db: MutableRefObject<Store> = useRef(null);

  async function submitForm() {
    try {
      // reset error and loading messages
      setLoading(true);
      setError("");
      // instantiate provider if none exists
      if (!dbProvider.current) {
        dbProvider.current = await injector.createDBProvider();
      }
      // instantiate database if none exists
      if (!db.current) {
        db.current = await dbProvider.current.createDatabase(name);
      }
      // calculate address
      let address = `/orbitdb/${db.current.address.root}/${db.current.address.path}`;
      // Tear down IPFS and database instances
      await tearDown();
      // Set page URL to address
      history.push(address);
    } catch (e) {
      setError(e.toString());
      setLoading(false);
    }
  }

  // Close IPFS and database
  async function tearDown() {
    await db.current.close();
    await dbProvider.current.close();
  }

  if (loading) {
    return <div className={CreateFormStyles.loadingText}>Loading...</div>;
  }

  return (
    <div className={CreateFormStyles.createContainer}>
      { error !== '' && <div>An error occured: {error}</div>}
      <form onSubmit={submitForm} className={CreateFormStyles.formContainer}>
        <input className={CreateFormStyles.textField}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={"name"}
        />
        <button type="submit" value="create" className={CreateFormStyles.submitButton} >
          <IoMdHand className={CreateFormStyles.connectToGraphButton} size={'3em'}/>
        </button>
      </form>
    </div>
  );
});

export default CreateDbForm;
