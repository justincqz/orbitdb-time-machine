import React from 'react';
import { useParams } from 'react-router-dom';
import DatabaseStyle from 'src/database.module.css';

const DatabaseView: React.FC = () => {
  // URL parameters
  let {hash, name}: {hash: string, name: string} = useParams();

  return <div>
    Viewing: {`orbitdb/${hash}/${name}`}
  </div>
}

export default DatabaseView;