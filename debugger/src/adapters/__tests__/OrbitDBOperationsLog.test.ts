import Log from 'ipfs-log';
import { DatabaseProvider } from '../../providers/DatabaseProvider';
import { OrbitDBOperationsLog } from '../OrbitDBOperationsLog';

const mockLog = jest.genMockFromModule<Log>("ipfs-log");
const mockLogInstance = new mockLog();
const mockDatabaseProvider = jest.genMockFromModule<DatabaseProvider>("../../providers/DatabaseProvider");
// Currently no methods expected to be called, so empty object.
const mockDatabaseProviderInstance = {} as DatabaseProvider;

test('getInnerLog fetches correct oplog.', () => {
  const operationsLog = new OrbitDBOperationsLog(mockLogInstance, mockDatabaseProviderInstance);
  expect(operationsLog.getInnerLog()).toBe(mockLogInstance);
});
