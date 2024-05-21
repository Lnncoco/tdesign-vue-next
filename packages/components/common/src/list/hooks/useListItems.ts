import { computed } from '@td/adapter-vue';
import { isArray } from 'lodash-es';

import { useChildComponentSlots } from '@td/adapter-hooks';

export function useListItems() {
  const getChildComponentSlots = useChildComponentSlots();

  const listItems = computed(() => {
    const computedListItems = [];
    // 处理 slots
    const listItemSlots = getChildComponentSlots('ListItem');

    if (isArray(listItemSlots)) {
      for (const child of listItemSlots) {
        computedListItems.push({
          ...child.props,
          slots: child.children,
        } as any);
      }
    }
    return computedListItems;
  });

  return {
    listItems,
  };
}
