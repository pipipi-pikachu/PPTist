import { expect } from '@jest/globals';
import { YError } from 'yerror';
export function assertThrows(fn, type, message) {
    try {
        fn();
        throw new YError('E_UNEXPECTED_SUCCESS');
    }
    catch (err) {
        expect(err).toBeInstanceOf(type);
        expect(err.message).toEqual(message);
    }
}
//# sourceMappingURL=testUtils.js.map