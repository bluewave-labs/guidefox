import toastEmitter, { TOAST_EMITTER_KEY } from './toastEmitter';

export const emitToastError = (error) => {
  if (error.response?.data) {
    for (let i = 0; i < error.response.data.errors.length; i++) {
      toastEmitter.emit(
        TOAST_EMITTER_KEY,
        'An error occurred: ' + error.response.data.errors[i].msg
      );
    }
  } else {
    toastEmitter.emit(
      TOAST_EMITTER_KEY,
      'An error occurred. Please check your network connection and try again.'
    );
  }
};
