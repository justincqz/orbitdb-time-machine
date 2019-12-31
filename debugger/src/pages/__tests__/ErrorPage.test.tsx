import ErrorPage, { backButtonTestId } from '../ErrorPage';
import React from 'react';
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import { mount } from 'enzyme';

it('does not navigate on invalid address', () => {
  const history = createMemoryHistory();
  const wrapper = mount(
    <Router history={history}>
      <ErrorPage />
    </Router>,
  );

  wrapper.find(`[data-testid="${backButtonTestId}"]`).simulate('click');
  expect(history.location.pathname).toBe("/");
});
