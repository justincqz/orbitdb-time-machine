import Create, { homeButtonTestId } from '../Create';
import React from 'react';
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import { mount } from 'enzyme';

it('does not navigate on invalid address', () => {
  const history = createMemoryHistory();
  const wrapper = mount(
    <Router history={history}>
      <Create />
    </Router>,
  );

  wrapper.find(`[data-testid="${homeButtonTestId}"]`).simulate('click');
  expect(history.location.pathname).toBe("/")
});
