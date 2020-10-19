import {
  instanceOfActionBlock,
  instanceOfNotActionBlock,
  instanceOfNotPrincipalBlock,
  instanceOfNotResourceBlock,
  instanceOfPrincipalBlock,
  instanceOfResourceBlock
} from './instanceOfInterfaces';

describe('Util functions', () => {
  describe('instanceOfPrincipalBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfPrincipalBlock({
          principal: 'something'
        })
      ).not.toThrow();
      expect(instanceOfPrincipalBlock({ principal: 'something' })).toBe(true);
      expect(instanceOfPrincipalBlock({ notPrincipal: 'something' })).toBe(
        false
      );
    });
  });

  describe('instanceOfNotPrincipalBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfNotPrincipalBlock({
          notPrincipal: 'something'
        })
      ).not.toThrow();
      expect(instanceOfNotPrincipalBlock({ notPrincipal: 'something' })).toBe(
        true
      );
      expect(instanceOfNotPrincipalBlock({ principal: 'something' })).toBe(
        false
      );
    });
  });

  describe('instanceOfResourceBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfResourceBlock({
          resource: 'something'
        })
      ).not.toThrow();
      expect(instanceOfResourceBlock({ resource: 'something' })).toBe(true);
      expect(instanceOfResourceBlock({ notResource: 'something' })).toBe(false);
    });
  });

  describe('instanceOfActionBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfActionBlock({
          action: 'something'
        })
      ).not.toThrow();
      expect(instanceOfActionBlock({ action: 'something' })).toBe(true);
      expect(instanceOfActionBlock({ notAction: 'something' })).toBe(false);
    });
  });

  describe('instanceOfNotActionBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfNotActionBlock({
          notAction: 'something'
        })
      ).not.toThrow();
      expect(instanceOfNotActionBlock({ notAction: 'something' })).toBe(true);
      expect(instanceOfNotActionBlock({ action: 'something' })).toBe(false);
    });
  });

  describe('instanceOfNotResourceBlock', () => {
    it("doesn't throw an error", () => {
      expect(() =>
        instanceOfNotResourceBlock({
          notResource: 'something'
        })
      ).not.toThrow();
      expect(instanceOfNotResourceBlock({ notResource: 'something' })).toBe(
        true
      );
      expect(instanceOfNotResourceBlock({ resource: 'something' })).toBe(false);
    });
  });
});
