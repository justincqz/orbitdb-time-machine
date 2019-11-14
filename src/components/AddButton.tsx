import React from 'react';
import databaseStyles from '../pages/OrbitDBDatabaseView.module.css';
import { withRouter } from 'react-router-dom';
import { MdLibraryAdd } from 'react-icons/md';

// TODO: Allow people to manually style. Pass in className as props?
const AddButton: React.FC<{
  onClick(): void
}> = withRouter(({ history, onClick=undefined }) => {

  function handleOnClick() {
    if (onClick === undefined) {
      return;
    }

    onClick();
  }

  return (
    <div 
      className={databaseStyles.icon}
      onClick={handleOnClick}
    >
      <MdLibraryAdd size={'6vh'} />
    </div>
  );
});

export default AddButton;



