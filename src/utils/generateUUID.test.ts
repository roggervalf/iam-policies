import { generateUUID } from './generateUUID';

describe('generateUUID', () => {
  it('should generate a valid UUID', () => {
    const uuid = generateUUID();
    const RFC4122 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    expect(RFC4122.test(uuid)).toEqual(true);
  });
});
