import React from 'react';
import TextField from '@material-ui/core/TextField';

const LocalDBForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("asdf");
  }

  return (
    <div>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            id="outlined-local-db"
            label="Local DB Address"
            margin="normal"
            variant="outlined"
          />
        </form>
    </div>
  );
}

export default LocalDBForm;
