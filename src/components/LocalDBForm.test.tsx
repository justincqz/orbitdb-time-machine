import React from 'react';
import LocalDBForm from './LocalDBForm';
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import {render, fireEvent} from '@testing-library/react'

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('navigates to pathname equal to input to LocalDBForm', () => {
  // Update variables to grant us access to the location
  // and history objects in this test.
  const history = createMemoryHistory();
  const {container} = render(
    <Router history={history}>
      <LocalDBForm />
    </Router>,
  );

  // Simulate input into the text field and press enter.
  let testField = container.querySelector('input');
  let form = container.querySelector('form');
  fireEvent.change(testField, {target: { value: "asdf" }});
  fireEvent.submit(form);

  expect(history.location.pathname).toBe("/asdf")
});
