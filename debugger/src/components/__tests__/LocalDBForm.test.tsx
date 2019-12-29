import React from 'react';
import LocalDBForm from '../LocalDBForm';
import { errorBoxTestId, formInputTestId, formTestId, openFormTestId } from '../LocalDBForm';
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import {render, fireEvent, getByTestId} from '@testing-library/react';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('does not navigate on invalid address', () => {
  // Update variables to grant us access to the location
  // and history objects in this test.
  const history = createMemoryHistory();
  const { container } = render(
    <Router history={history}>
      <LocalDBForm />
    </Router>,
  );

  // Simulate input into the text field and press enter.
  const openButton = getByTestId(container, openFormTestId);
  fireEvent.click(openButton);
  const testField = getByTestId(container, formInputTestId);
  const form = getByTestId(container, formTestId);  
  fireEvent.change(testField, {target: { value: "asdf" }});
  fireEvent.submit(form);

  expect(history.location.pathname).toBe("/")
});

it('displays an error message on invalid address', async () => {
  const history = createMemoryHistory();
  const { container, findByTestId } = render(
  <Router history={history}>
    <LocalDBForm />
  </Router>
  );
  
  const openButton = getByTestId(container, openFormTestId);
  fireEvent.click(openButton);
  const testField = getByTestId(container, formInputTestId);
  const form = getByTestId(container, formTestId);
  fireEvent.submit(form);

  const errorMessage = await findByTestId(errorBoxTestId);

  expect(errorMessage).not.toBe(null);

});

it('navigates to correct url on valid address', () => {
  const validAddress = '/orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello'
  const history = createMemoryHistory();
  const {container} = render(
    <Router history={history}>
      <LocalDBForm />
    </Router>,
  );

  const openButton = getByTestId(container, openFormTestId);
  fireEvent.click(openButton);
  // Simulate input into the text field and press enter.
  const testField = getByTestId(container, formInputTestId);
  const form = getByTestId(container, formTestId);
  fireEvent.change(testField, {target: { value: validAddress }});
  fireEvent.submit(form);

  expect(history.location.pathname).toBe(validAddress)
})
