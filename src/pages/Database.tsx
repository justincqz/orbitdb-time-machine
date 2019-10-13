import React from 'react';
import { useParams } from 'react-router-dom';
import GraphDisplay from '../components/GraphDisplay';

const DatabaseView: React.FC = () => {
  // URL parameters
  let {hash, name}: {hash: string, name: string} = useParams();

  return <div>
    Viewing: {`orbitdb/${hash}/${name}`}
    <GraphDisplay />
  </div>
}

export default DatabaseView;
