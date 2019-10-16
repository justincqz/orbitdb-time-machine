import React from 'react';
import CreateDbForm from '../components/CreateDbForm'
import CreateStyle from './Create.module.css';

const Create: React.FC = () => {
  return <div className={CreateStyle.container}>
    <h1>Create a database</h1>
    <CreateDbForm />
  </div>
}

export default Create;
