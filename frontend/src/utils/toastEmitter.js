import { EventEmitter } from 'events';

const toastEmitter = new EventEmitter();

export const TOAST_EMITTER_KEY = 'showToast';

export default toastEmitter;
