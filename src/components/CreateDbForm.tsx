import React, { useState, MutableRefObject, useRef, useEffect } from "react";
import { useDependencyInjector } from "../state/dependencyInjector";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { Store } from "orbit-db-store";
import { withRouter } from 'react-router-dom';
import CreateFormStyles from './CreateDBForm.module.css';
import { IoMdHand } from "react-icons/io";

const CreateDbForm: React.FC = withRouter(({ history }) => {
  const [name, setName] = useState("");
  const [isPublic, setPublic] = useState(true);
  const injector = useDependencyInjector();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let dbProvider: MutableRefObject<DatabaseProvider> = useRef(null);
  let db: MutableRefObject<Store> = useRef(null);

  // Initialises the database provider, whenever the injector changes, reinstantiate provider
  useEffect(() => {
    const initialiseDBProvider = async () => {
      dbProvider.current = await injector.createDBProvider();
    };

    initialiseDBProvider();
  }, [injector]);

  function togglePublic() {
    setPublic(!isPublic);
  }
  
  async function submitForm() {
    try {
      // reset error and loading messages
      setLoading(true);
      setError("");
      
      // Instantiate providers and database if they are undefined
      if (!dbProvider.current) dbProvider.current = await injector.createDBProvider();
      if (!db.current) db.current = await dbProvider.current
        .createDBFactory()
        .setName(name)
        .addOptions({isPublic})
        .create();

      // Calculate address
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
    <div>
      <div className={CreateFormStyles.createTextContainer}>
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
      <div className={CreateFormStyles.createCheckboxContainer} onClick={togglePublic}>
        Public
        <input className={CreateFormStyles.optionSelect}
          type="checkbox"
          checked={isPublic}
          readOnly
        />
        <span className={CreateFormStyles.checkbox}>
          <div className={CreateFormStyles.checkmark}>{isPublic ? '✓' : ''}</div>
        </span>
      </div>
    </div>
  );
});

export default CreateDbForm;
