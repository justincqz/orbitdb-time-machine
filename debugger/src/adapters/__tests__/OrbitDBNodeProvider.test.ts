import { DAGNode } from 'orbit-db-time-machine-logger';
import { OrbitDBNodeProvider } from '../OrbitDBNodeProvider';
import Store from 'orbit-db-store';
import Index from 'orbit-db-store/src/Index';
import EventIndex from 'orbit-db-eventstore/src/EventIndex';
import KeyValueIndex from 'orbit-db-kvstore/src/KeyValueIndex';
import FeedIndex from 'orbit-db-feedstore/src/FeedIndex';
import CounterIndex from 'orbit-db-counterstore/src/CounterIndex';
import DocumentIndex from 'orbit-db-docstore/src/DocumentIndex';
import OrbitDBDatabaseTypes from "../OrbitDBDatabaseTypes";
import { DatabaseProvider } from "../../providers/DatabaseProvider";
import OperationsLog from '../../providers/OperationsLog';

afterEach(() => {
  jest.clearAllMocks();
});

const mockDBProvider = {

} as DatabaseProvider;

const mockOperationsLog = {
  getInnerLog: jest.fn(() => {
    return {
      values: []
    };
  })
} as OperationsLog;

it('reconstructs EventIndex correctly', () => {

  const mockEventStore = {
    type: OrbitDBDatabaseTypes.EventStore
  } as Store;
  
  const nodeProvider = new OrbitDBNodeProvider(mockEventStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBeInstanceOf(EventIndex);

});

it('reconstructs DocumentIndex correctly', () => {

  const mockDocumentStore = {
    type: OrbitDBDatabaseTypes.DocumentStore
  } as Store;
  
  const nodeProvider = new OrbitDBNodeProvider(mockDocumentStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBeInstanceOf(DocumentIndex);

});

it('reconstructs FeedIndex correctly', () => {

  const mockFeedStore = {
    type: OrbitDBDatabaseTypes.FeedStore
  } as Store;
  
  const nodeProvider = new OrbitDBNodeProvider(mockFeedStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBeInstanceOf(FeedIndex);

});

it('reconstructs CounterIndex correctly', () => {

  const mockCounterStore = {
    type: OrbitDBDatabaseTypes.CounterStore
  } as Store;
  
  const nodeProvider = new OrbitDBNodeProvider(mockCounterStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBeInstanceOf(CounterIndex);

});

it('reconstructs KeyValueIndex correctly', () => {

  const mockKeyValueStore = {
    type: OrbitDBDatabaseTypes.KeyValueStore
  } as Store;
  
  const nodeProvider = new OrbitDBNodeProvider(mockKeyValueStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBeInstanceOf(KeyValueIndex);

});

it('reconstruction handles invalid store type', () => {

  const mockWrongStore = {
    type: "blahblahblacksheep"
  } as Store;

  const nodeProvider = new OrbitDBNodeProvider(mockWrongStore, mockDBProvider);
  expect(nodeProvider.reconstructData(mockOperationsLog)).toBe(null);

});
