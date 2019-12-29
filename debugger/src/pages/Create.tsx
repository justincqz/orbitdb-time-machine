import React from 'react';
import CreateDBForm from '../components/CreateDBForm'
import CreateStyles from './Create.module.css';
import { MdHome } from 'react-icons/md';
import { withRouter } from 'react-router-dom';

const Create: React.FC = withRouter(({ history }) => {

  const goHome = () => {
    history.push("/");
  }

  return (
    <div className={CreateStyles.container}>
      <div className={CreateStyles.icon} onClick={goHome}>
        <MdHome size={'8vh'} />
      </div>
      <div className={CreateStyles.titleContainer}>
        <span className={CreateStyles.createTitle}>Create a database</span>
      </div>
      <CreateDBForm />
    </div>
  )
});

export default Create;
