import { 
  instanceOfPrincipalBlock,
  instanceOfResourceBlock,
  instanceOfActionBlock,
  instanceOfNotResourceBlock
} from '../src/utils';


/*export function instanceOfResourceBlock(object: any): object is ResourceBlock {
  return 'resource' in object;
}

export function instanceOfActionBlock(object: any): object is ActionBlock {
  return 'action' in object;
}

export function instanceOfNotResourceBlock(object: any): object is NotResourceBlock {
  return 'notResource' in object;
}

export function instanceOfPrincipalBlock(object: any): object is PrincipalBlock {
  return 'principal' in object;
}*/
export default (): void => {
  describe('Util functions', () => {
    describe('instanceOfPrincipalBlock', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
            instanceOfPrincipalBlock({
              principal:'something'
            })
        ).not.toThrow();
        expect(instanceOfPrincipalBlock({principal:'something'})).toBe(true);
        expect(instanceOfPrincipalBlock({notPrincipal:'something'})).toBe(false);
      });
    });

    describe('instanceOfResourceBlock', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
            instanceOfResourceBlock({
              resource:'something'
            })
        ).not.toThrow();
        expect(instanceOfResourceBlock({resource:'something'})).toBe(true);
        expect(instanceOfResourceBlock({notResource:'something'})).toBe(false);
      });
    });

    describe('instanceOfActionBlock', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
          instanceOfActionBlock({
            action:'something'
          })
        ).not.toThrow();
        expect(instanceOfActionBlock({action:'something'})).toBe(true);
        expect(instanceOfActionBlock({notAction:'something'})).toBe(false);
      });
    });

    describe('instanceOfNotResourceBlock', () => {
      it('don\'t throw an error', () => {
        expect(
          () =>
            instanceOfNotResourceBlock({
              notResource:'something'
            })
        ).not.toThrow();
        expect(instanceOfNotResourceBlock({notResource:'something'})).toBe(true);
        expect(instanceOfNotResourceBlock({resource:'something'})).toBe(false);
      });
    });
  });
};
