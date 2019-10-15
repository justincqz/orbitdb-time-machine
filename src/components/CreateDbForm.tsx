import React, { useState } from "react";
import { useDependencyInjector } from "../state/dependencyInjector";
import { withRouter } from 'react-router-dom';

const CreateDbForm: React.FC = withRouter(({ history }) => {
  const [name, setName] = useState("");
  const injector = useDependencyInjector();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitForm() {
    try {
      setLoading(true);
      setError('');
      let dbProvider = await injector.createDBProvider();
      let db = await dbProvider.createDatabase(name);
      console.log(db.address);
      history.push(`/orbitdb/${db.address.root}/${db.address.path}`);
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      { error !== '' && <div>An error occured: {error}</div>}
      <form onSubmit={submitForm}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input type="submit" value="create" />
      </form>
    </div>
  );
});

export default CreateDbForm;
