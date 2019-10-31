import React from 'react';
import databaseStyles from '../pages/Database.module.css';
import { withRouter } from 'react-router-dom';
import { MdHome } from 'react-icons/md';

const HomeButton: React.FC = withRouter(({ history }) => {

  const goHome = () => {
    history.push("/");
  }

  return (
    <div className={databaseStyles.icon} onClick={goHome}>
      <MdHome size={'6vh'} />
    </div>
  );
});

export default HomeButton;
