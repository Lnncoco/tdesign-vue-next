import { mount } from '@vue/test-utils';
import Popconfirm from '@/src/popconfirm/index.ts';

// every component needs four parts: props/events/slots/functions.
describe('Popconfirm', () => {
  // test props api
  describe(':props', () => {
    it('', () => {
      const wrapper = mount({
        render() {
          return <Popconfirm></Popconfirm>;
        },
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  // test events
  describe('@event', () => {
    expect(true).toEqual(true);
  });

  // test slots
  describe('<slot>', () => {
    it('', () => {
      expect(true).toEqual(true);
    });
  });

  // test exposure function
  describe('function', () => {
    it('', () => {
      expect(true).toEqual(true);
    });
  });
});
