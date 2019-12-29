import OrbitDB from "orbit-db";
import OrbitDBFactory from "../OrbitDBFactory";
import OrbitDBDatabaseTypes from "../OrbitDBDatabaseTypes";

const dbTestName = "TestDatabase";

const mockOrbitDB = jest.genMockFromModule<OrbitDB>("orbit-db");
const mockInstance = new mockOrbitDB();

// Reset mock counts for the create function only.
beforeEach(() => {
  mockInstance.create.mockClear();
})

it('defaults to EventStore type', () => {
  const factory = new OrbitDBFactory(mockInstance, dbTestName);
  factory.create();

  expect(mockInstance.create).toHaveBeenCalledTimes(1);
  expect(mockInstance.create).toHaveBeenCalledWith(expect.anything(), OrbitDBDatabaseTypes.EventStore, undefined);
});

it('creates correctly with altered parameters', () => {
  const factory = new OrbitDBFactory(mockInstance, dbTestName);

  const newDBTestName = "NewTestDatabase";
  const newDBType = OrbitDBDatabaseTypes.CounterStore;
  factory.setName(newDBTestName);
  factory.setType(newDBType);
  factory.create();

  expect(mockInstance.create).toHaveBeenCalledTimes(1);
  expect(mockInstance.create).toHaveBeenCalledWith(newDBTestName, newDBType, undefined);
});


