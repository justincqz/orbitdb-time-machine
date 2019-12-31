import OrbitDBStoreDisplay from '../OrbitDBStoreDisplay';
import { D3Data }  from 'orbit-db-time-machine-logger';
import { NodeProvider } from '../../providers/NodeProvider';
import DatabaseUIProvider from '../../providers/DatabaseUIProvider';
import { DatabaseProvider } from '../../providers/DatabaseProvider';
import { mount } from 'enzyme';
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
});

afterAll(() => {
  console.error = originalError
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockOperationLogData = {
  id: "zdpuAzmip8NBwRP14oGo7shZX7xCemV6qrvTHHzePZjC7Mv8T0.8968699319288953",
  payload: {
    actualId: "zdpuAzmip8NBwRP14oGo7shZX7xCemV6qrvTHHzePZjC7Mv8T",
    identity: "03c82849a0fcbac3d389c44d96c7c108442bb72d03c7e6f3890acc6a1b2939597a"
  },
  children: []
} as D3Data;

const mockNodeProvider = {
  getNodeInfoFromHash: jest.fn((entryHash) => {
    return new Promise<any>(function(resolve, reject) {
      resolve({});
    });
  }),
  getDatabaseGraph: jest.fn(),
  listenForDatabaseGraph: jest.fn(),
  listenForLocalWrites: jest.fn(),
  getEdges: jest.fn(),
  getNodeInfo: jest.fn(),
  getOperationsLog: jest.fn(),
  reconstructData: jest.fn(),
} as NodeProvider;

const mockDBProvider = {

} as DatabaseProvider;

const mockUiProvider = {
  getSidebar: jest.fn(),
  getDataDisplay: jest.fn(),
  getTooltipMsg: jest.fn((mockNodeInfo) => {
    return "mockTooltipMsg";
  }),
  getTooltipTitle: jest.fn((mockNodeInfo) => {
    return "mockTooltipTitle";
  }),
} as DatabaseUIProvider;

const defaultRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
} as ClientRect;

// Uses GraphDisplay implementation detail to issue mouse events.
// The correct way would be to hover over a rendered 'circle', but
// enzyme is known to have issues detecting d3 appended elements.
it('tooltip appears on hover and disappears on mouseleave', () => {

  let wrapper;
  
  wrapper = mount(
    <OrbitDBStoreDisplay
      operationLogData={mockOperationLogData}
      nodeProvider={mockNodeProvider}
      dbProvider={mockDBProvider}
      uiProvider={mockUiProvider}
    />
  );
  
  expect(wrapper.find('DAGNodeTooltip').exists()).toBeFalsy();
  expect(wrapper.find('GraphDisplay').exists()).toBeTruthy();

  wrapper.find('GraphDisplay').prop('mouseEvents')['mouseenter']("mockEntryHash", { getBoundingClientRect: jest.fn(() => {return defaultRect}) });
  wrapper.update();
  expect(wrapper.find('DAGNodeTooltip').exists()).toBeTruthy();

  wrapper.find('GraphDisplay').prop('mouseEvents')['mouseleave']("mockEntryHash", { getBoundingClientRect: jest.fn(() => {return defaultRect}) });
  wrapper.update();
  expect(wrapper.find('DAGNodeTooltip').exists()).toBeFalsy();
});

// it('tooltip shows correct information', () => {

// });

// it('database appears on click', () => {

// });

