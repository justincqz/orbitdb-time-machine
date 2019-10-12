import React from 'react';
import { withRouter } from 'react-router-dom';
import useDBFormHandler from 'src/components/useDBFormHandler';
import FormStyles from 'src/components/LocalDBForm.module.css';

const LocalDBForm: React.FC = withRouter(({ history }) => {
  const { error, address, setAddress, submit } = useDBFormHandler(history); 

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  }

  return (
    <div className={FormStyles.container}>
      { error != null && (
        <div className={FormStyles.error}>
          { error }
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate autoComplete="off" className={FormStyles.formContainer}>
        <input className={FormStyles.textField}
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}>
        </input>
        <input type='submit' className={FormStyles.submitButton} />
      </form>
    </div>
  );
})

export default LocalDBForm;
