import React from 'react';
import CreateDbForm from '../components/CreateDbForm'
import CreateStyles from './Create.module.css';


const Create: React.FC = () => {
  return (
    <div className={CreateStyles.container}>
      <div className={CreateStyles.titleContainer}>
        <span className={CreateStyles.createTitle}>Create a database</span>
      </div>
      <CreateDbForm />
    </div>
  )
}

export default Create;
