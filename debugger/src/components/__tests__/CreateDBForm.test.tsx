import CreateDBForm from '../CreateDBForm';
import { mount } from 'enzyme';
import { accessControlTestId, formTestId } from '../CreateDBForm';
import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { InjectorProvider } from '../../state/dependencyInjector';
import { DatabaseProvider } from "../../providers/DatabaseProvider";

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

const mockDatabaseFactory = {
  create: jest.fn(),
  setName: jest.fn(),
  setType: jest.fn(),
  addOptions: jest.fn(),
};

const mockDBProvider = {
  createDBFactory: jest.fn((name) => {
    return mockDatabaseFactory;
  }),
  openDatabase: jest.fn(),
  close: jest.fn(),
  operationsLogFromSnapshot: jest.fn(),
  constructOperationsLogFromEntries: jest.fn()
};

const mockInjectorProvider = {
  createJoinStorageProvider: jest.fn(),
  createDBProvider: jest.fn(() => {
    return new Promise<DatabaseProvider>(function(resolve, reject) {
      resolve(mockDBProvider);
    });
  }),
  createNodeProvider: jest.fn()
};

it('uses the correct db provider', async () => {

  const wrapper = mount(
    <InjectorProvider injector={mockInjectorProvider}>
      <Router>
        <CreateDBForm />
      </Router>
    </InjectorProvider>
  );

  wrapper.find(`[data-testid="${formTestId}"]`).simulate('submit');

  expect(mockInjectorProvider.createDBProvider).toBeCalledTimes(2);
  await expect(mockInjectorProvider.createDBProvider.mock.results[0].value).resolves.toEqual(mockDBProvider);
  expect(mockDBProvider.createDBFactory).toHaveBeenCalledTimes(1);
});

it('public settings can be toggled', async () => {

  const wrapper = mount(
    <InjectorProvider injector={mockInjectorProvider}>
      <Router>
        <CreateDBForm />
      </Router>
    </InjectorProvider>
  );

  wrapper.find(`[data-testid="${accessControlTestId}"]`).simulate('click');
  wrapper.find(`[data-testid="${formTestId}"]`).simulate('submit');

  expect(mockInjectorProvider.createDBProvider).toBeCalledTimes(2);
  await expect(mockInjectorProvider.createDBProvider.mock.results[0].value).resolves.toEqual(mockDBProvider);
  expect(mockDBProvider.createDBFactory).toHaveBeenCalledTimes(1);
  expect(mockDBProvider.createDBFactory.mock.results[0].value).toBe(mockDatabaseFactory);
  wrapper.update();
  expect(mockDatabaseFactory.addOptions).toHaveBeenCalledWith({isPublic: false});
});

// it('public settings can be toggled', async () => {

//   const dbTestName = "NewDatabase";

//   render(
//     <InjectorProvider injector={mockInjectorProvider}>
//       <Router>
//         <CreateDBForm />
//       </Router>
//     </InjectorProvider>
//   );

//   const accessControlButton = screen.getByTestId(accessControlTestId);
//   // const nameInputField = screen.getByTestId(formInputTestId);
//   const form = screen.getByTestId(formTestId);  

//   act(() => {
//     fireEvent.click(accessControlButton);
//     // fireEvent.change(nameInputField, {target: { value: dbTestName }});
//     fireEvent.submit(form);
//   });

//   expect(mockInjectorProvider.createDBProvider).toBeCalledTimes(2);
//   await expect(mockInjectorProvider.createDBProvider.mock.results[0].value).resolves.toEqual(mockDBProvider);
//   expect(mockDBProvider.createDBFactory).toHaveBeenCalledTimes(1);
//   expect(mockDBProvider.createDBFactory.mock.results[0].value).toBe(mockDatabaseFactory);
//   expect(mockDatabaseFactory.addOptions).toHaveBeenCalledWith({isPublic: false});
// });
