import { Plugin, App, createApp } from 'vue';
import { createPopper, Instance } from '@popperjs/core';
import { getAttach } from '../utils/dom';
import { getPopperPlacement } from './utils';

import popupOverlayComponent from './overlay';

import type { TNode } from '../common';
import type { TdPopupProps } from './type';

export interface PopupPluginApi {
  config: TdPopupProps;
}

export type PopupPluginMethod = (
  triggerEl: string | HTMLElement,
  content: TNode,
  popupProps?: TdPopupProps,
) => Instance;

export type PopupPluginType = Plugin & PopupPluginMethod;

let popperInstance: Instance;
let overlayInstance: HTMLElement;
let triggerEl: HTMLElement | Element;

const removeOverlayInstance = () => {
  if (overlayInstance) {
    overlayInstance.remove();
    overlayInstance = null;
  }
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
};

export const createPopupPlugin: PopupPluginMethod = (trigger, content, popupProps) => {
  const currentTriggerEl = getAttach(trigger);

  triggerEl = currentTriggerEl;
  removeOverlayInstance();

  let overlayAttach = getAttach(popupProps?.attach || 'body');

  // const delay = [].concat(popupProps?.delay ?? [250, 150]);
  // const closeDelay = delay[1] ?? delay[0];
  if (overlayAttach === document.body) {
    // don't allow mount on body directly
    const popupDom = document.createElement('div');
    document.body.appendChild(popupDom);
    overlayAttach = popupDom;
  }
  const overlayInstance = createApp(popupOverlayComponent, {
    ...popupProps,
    content,
    triggerElement: triggerEl,
  }).mount(overlayAttach).$el;

  popperInstance = createPopper(triggerEl, overlayInstance, {
    placement: getPopperPlacement(popupProps?.placement || ('top' as TdPopupProps['placement'])),
    ...popupProps?.popperOptions,
  });
  return popperInstance;
};

const PopupPlugin: PopupPluginType = createPopupPlugin as PopupPluginType;

PopupPlugin.install = (app: App) => {
  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$popup = createPopupPlugin;
};

export default PopupPlugin;
