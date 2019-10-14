import React from 'react';
import { withRouter } from 'react-router-dom';
import useDBFormHandler from '../components/useDBFormHandler';
import FormStyles from './LocalDBForm.module.css';

export const errorBoxTestId = "errorBox";
export const formInputTestId = "formInputField";
export const formTestId = "form";

const LocalDBForm: React.FC = withRouter(({ history }) => {
  const { error, address, setAddress, submit } = useDBFormHandler(history); 

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  }

  return (
    <div className={FormStyles.container}>
      { error != null && (
        <div className={FormStyles.error} data-testid={errorBoxTestId}>
          { error }
        </div>
      )}
      <form 
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        className={FormStyles.formContainer}
        data-testid={formTestId}>
        <input
          data-testid={formInputTestId}
          className={FormStyles.textField}
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
