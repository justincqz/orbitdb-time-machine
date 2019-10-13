import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GraphDisplay from '../components/GraphDisplay';
import { useDependencyInjector } from '../state/dependencyInjector';
import { D3Data } from '../utils/D3Data';
 
const DatabaseView: React.FC = () => {
  // URL parameters
  let {hash, name}: {hash: string, name: string} = useParams();
  const injector = useDependencyInjector();
  const dbProvider = injector.createDbProvider(`/orbitdb/${hash}/${name}`);
  console.log(`orbitdb/${hash}/${name}`)
  // Limit number of nodes to fetch
  const LIMIT = 10;

  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(true);
  const [d3data, setD3data]: [D3Data, React.Dispatch<React.SetStateAction<D3Data>>] = useState(null);
  const [error, setError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState('');
  
  useEffect(() => {
    loadData();
  });

  async function loadData(): Promise<void> {
    setLoading(true);
    try {
      let childNode = await dbProvider.getDatabaseGraph();
      setD3data(childNode.toD3Data(LIMIT));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div>
    Viewing: {`orbitdb/${hash}/${name}`}
    <GraphDisplay inputData={d3data} />
  </div>
}

export default DatabaseView;
