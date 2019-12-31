import DocStoreUI, { formTestId, openEditorTestId } from '../DocStoreUI';
import { mount } from 'enzyme';
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
  put: jest.fn((inputJSON) => {})
} as Store;

it('adds to DocStore the input as a valid JSON', () => {

  const jsonToAdd = {
    _id: "mockID"
  };

  const uiProvider = new DocStoreUI();
  const SideBar = uiProvider.getSidebar;

  const wrapper = mount(<SideBar store={mockStore} />);

  // Hard-coded button id here.
  wrapper.find(`[data-testid="Add"]`).simulate('click');
  wrapper.update();

  wrapper.find(`[data-testid="${openEditorTestId}"]`).simulate('click');
  wrapper.update();

  wrapper.find('ReactAce').instance().editor.setValue(JSON.stringify(jsonToAdd));
  wrapper.find(`[data-testid="${formTestId}"]`).simulate('submit');

  wrapper.update();
  expect(mockStore.put).toHaveBeenCalledWith(jsonToAdd);
});
