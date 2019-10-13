import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from "history";
import useDBFormHandler from './useDBFormHandler';

test('canSetValue', () => {
  const history = createMemoryHistory();
  const { address, setAddress } = renderHook(() => useDBFormHandler(history)).result.current;

  setAddress('hello');

  expect(address).toBe('hello'); 
})