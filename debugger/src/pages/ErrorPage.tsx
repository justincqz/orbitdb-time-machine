import React from 'react';
import logo from "./logo.png";
import ErrorStyles from "./ErrorPage.module.css";
import { withRouter } from 'react-router-dom';

export const backButtonTestId = "backButtonTestId";

const ErrorPage: React.FC = withRouter(({ history }) => {
  const goBack = () => {
    history.push("/");
  };

  return (
    <div className={ErrorStyles.container}>
      <img src={logo} alt="logo" className={ErrorStyles.logo}/>
      <p>This is not the page you are looking for</p>
      <button 
        data-testid={backButtonTestId}
        onClick={goBack}
      >
        Go back to front page
      </button>
    </div>
  );
});

export default ErrorPage;
