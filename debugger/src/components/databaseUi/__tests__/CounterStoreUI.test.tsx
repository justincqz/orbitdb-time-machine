import CounterStoreUI, { incrementFieldTestId, formTestId } from '../CounterStoreUI';
import { shallow } from 'enzyme';
import { Store } from "orbit-db-store";
import React from 'react';

// this is just a little hack to silence a warning that we'll get until we
// upgrade to 16.9: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

afterEach(() => {
  jest.clearAllMocks();
});

const mockStore = {
  inc: jest.fn((amount) => {})
} as Store;

it('increments CounterStore by sidebar input amount', () => {

  const incrementValue = 123;

  const uiProvider = new CounterStoreUI();
  const SideBar = uiProvider.getSidebar;

  const wrapper = shallow(<SideBar store={mockStore} />);

  // Hard-coded button id here.
  wrapper.find(`[data-testid="Increment"]`).simulate('click');
  wrapper.update();

  const incrementEvent = {target: { value: incrementValue }};
  wrapper.find(`[data-testid="${incrementFieldTestId}"]`).simulate('change', incrementEvent);
  wrapper.find(`[data-testid="${formTestId}"]`).simulate('submit');

  wrapper.update();
  expect(mockStore.inc).toHaveBeenCalledWith(incrementValue);
});
