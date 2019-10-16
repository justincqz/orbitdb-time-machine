import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import useDBFormHandler from '../components/useDBFormHandler';
import FormStyles from './LocalDBForm.module.css';
import { FaCodeBranch } from "react-icons/fa";

const baseStyles = {
  open: {
    width: '50vw',
  },
  closed: {
    width: '6vw',
    margin: '0 0 0 13vw'
  }
};

export const errorBoxTestId = "errorBox";
export const formInputTestId = "formInputField";
export const formTestId = "form";

const LocalDBForm: React.FC = withRouter(({ history }) => {
  const [isOpen, setOpen] = useState(false);
  const { error, address, setAddress, submit } = useDBFormHandler(history); 

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const toggleVisibility = () => {
    setOpen(true);
  };

  const divStyle = isOpen ? baseStyles.open : baseStyles.closed;

  return (
    <div className={FormStyles.overContainer}>
      <div className={FormStyles.container}>
        { error != null && (
          <div className={FormStyles.error} data-testid="errorBox">
            { error }
          </div>
        )}
        <div className={FormStyles.connectContainer}>
          <div className={FormStyles.connectButton} style={divStyle} onClick={toggleVisibility}>
            { isOpen
                ?
                  <form onSubmit={handleSubmit} noValidate autoComplete="off" className={FormStyles.formContainer}>
                    <input className={FormStyles.textField}
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}>
                    </input>
                    <button type='submit' className={FormStyles.submitButton} >
                      <FaCodeBranch className={FormStyles.connectToGraphButton} size={'3em'}/>
                    </button>
                  </form>
                : <div/>
            }
          </div>
          { !isOpen
              ? <span className={FormStyles.connectTitle}>connect</span>
              : <div/>
          }
        </div>
        <div className={FormStyles.createContainer}>
          <div className={FormStyles.createButton} >
            <a href='/create'>t</a>
          </div>
          <span className={FormStyles.connectTitle}>create</span>
        </div>
      </div>
    </div>
  );
});

export default LocalDBForm;
