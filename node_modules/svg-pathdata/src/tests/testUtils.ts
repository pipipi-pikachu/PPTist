import { expect } from '@jest/globals';
import { YError } from 'yerror';

export function assertThrows<T>(
  fn: () => void,
  type: T,
  message: string,
) {
  try {
    fn();
    throw new YError('E_UNEXPECTED_SUCCESS');
  } catch (err) {
    expect(err).toBeInstanceOf(type);
    expect((err as Error).message).toEqual(message);
  }
}
