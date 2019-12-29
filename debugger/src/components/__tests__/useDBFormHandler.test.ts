import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from "history";
import useDBFormHandler from '../useDBFormHandler';
import { act } from '@testing-library/react-hooks';

test('canSetValue', () => {
  const history = createMemoryHistory();
  const { result } = renderHook(() => useDBFormHandler(history));

  act(() => { result.current.setAddress('hello') });

  expect(result.current.address).toBe('hello');
});
