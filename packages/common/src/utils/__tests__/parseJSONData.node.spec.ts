/**
 * Unit‑tests for parseJSONData<T>().
 * Runs in the “node” Jest project.
 */
import { parseJSONData } from '../parseJSONData';

interface User {
  id: number;
  name: string;
}

describe('parseJSONData<T>()', () => {
  it('returns typed object when JSON is valid', () => {
    const json = '{"id":1,"name":"Ada"}';
    const result = parseJSONData<User>(json);

    expect(result).toEqual({ id: 1, name: 'Ada' });
  });

  it('returns undefined when JSON is malformed', () => {
    const badJson = '{"id":1,"name":"Ada"'; // missing }
    const result = parseJSONData<User>(badJson);

    expect(result).toBeUndefined();
  });
});
