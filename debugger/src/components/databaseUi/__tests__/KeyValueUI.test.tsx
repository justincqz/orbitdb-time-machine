import KeyValueUI, {
   inputTestId,
   inputOneTestId,
   inputTwoTestId,
   oneInputFormTestId,
   twoInputFormTestId
} from '../KeyValueUI';
import { shallow, mount} from 'enzyme';
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
  put: jest.fn((key, val) => {}),
  set: jest.fn((key, val) => {}),
  del: jest.fn((key) => {})
} as Store;

it('correctly puts key value pairs', () => {
  const key = "mockKey";
  const value = "mockValue";

  const uiProvider = new KeyValueUI();
  const SideBar = uiProvider.getSidebar;

  const wrapper = shallow(<SideBar store={mockStore} />);

  // Hard-coded button id here.
  wrapper.find(`[data-testid="Add"]`).simulate('click');
  wrapper.update();

  const changeEventKey = {target: { value: key }};
  const changeEventValue = {target: { value: value }};
  wrapper.find(`[data-testid="${inputOneTestId}"]`).simulate('change', changeEventKey);
  wrapper.find(`[data-testid="${inputTwoTestId}"]`).simulate('change', changeEventValue);
  wrapper.find(`[data-testid="${twoInputFormTestId}"]`).simulate('submit');

  wrapper.update();
  expect(mockStore.put).toHaveBeenCalledWith(key, value);
});

it('correctly sets key value pairs', () => {
  const key = "mockKey";
  const value = "mockValue";

  const uiProvider = new KeyValueUI();
  const SideBar = uiProvider.getSidebar;

  const wrapper = shallow(<SideBar store={mockStore} />);

  // Hard-coded button id here.
  wrapper.find(`[data-testid="Set"]`).simulate('click');
  wrapper.update();

  const changeEventKey = {target: { value: key }};
  const changeEventValue = {target: { value: value }};
  wrapper.find(`[data-testid="${inputOneTestId}"]`).simulate('change', changeEventKey);
  wrapper.find(`[data-testid="${inputTwoTestId}"]`).simulate('change', changeEventValue);
  wrapper.find(`[data-testid="${twoInputFormTestId}"]`).simulate('submit');

  wrapper.update();
  expect(mockStore.set).toHaveBeenCalledWith(key, value);
});

it('correctly deletes key value pairs', () => {
  const key = "mockKey";
  const value = "mockValue";

  const uiProvider = new KeyValueUI();
  const SideBar = uiProvider.getSidebar;

  const wrapper = shallow(<SideBar store={mockStore} />);

  // Hard-coded button id here.
  wrapper.find(`[data-testid="Del"]`).simulate('click');
  wrapper.update();

  const changeEventKey = {target: { value: key }};
  wrapper.find(`[data-testid="${inputTestId}"]`).simulate('change', changeEventKey);
  wrapper.find(`[data-testid="${oneInputFormTestId}"]`).simulate('submit');

  wrapper.update();
  expect(mockStore.del).toHaveBeenCalledWith(key);
});
