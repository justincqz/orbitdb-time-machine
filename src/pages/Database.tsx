import React from 'react';
import { useParams } from 'react-router-dom';

const DatabaseView: React.FC = () => {
  // URL parameters
  let {hash, name}: {hash: string, name: string} = useParams();

  return <div>
    Viewing: {`orbitdb/${hash}/${name}`}
  </div>
}

export default DatabaseView;