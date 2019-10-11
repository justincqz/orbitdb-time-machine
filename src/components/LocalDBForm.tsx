import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';

const LocalDBForm: React.FC = withRouter(({history}) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    history.push(address)
  }  

  return (
    <div>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <input
            type="text"
            onChange={(e) => {
              setAddress(e.target.value);
            }}>
          </input>
        </form>
    </div>
  );
})

export default LocalDBForm;
