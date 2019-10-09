import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const LocalDBForm: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(5),
        minWidth: 120,
      }
    }),
  );

  const classes = useStyles();

  const [state, setState] = React.useState<{ store: string | number; name: string }>({
    store: '',
    name: 'hai',
  });

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

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
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="store-native-simple">Store Type</InputLabel>
            <Select
              native
              value={state.store}
              onChange={handleChange('store')}
              inputProps={{
                name: 'store',
                id: 'store-native-simple',
              }}
            >
              <option value="" />
              <option value="eventlog">EventLog</option>
              <option value="feed">Feed</option>
              <option value="key-value">Key-Value</option>
              <option value="documentdb">Document DB</option>
              <option value="counter">Counter</option>
            </Select>
          </FormControl>
        </form>
    </div>
  );
}

export default LocalDBForm;
