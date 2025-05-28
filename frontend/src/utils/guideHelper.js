import toastEmitter, { TOAST_EMITTER_KEY } from './toastEmitter';

export const emitToastError = (error) => {
  if (error.response?.data) {
    for (let i = 0; i < error.response.data.errors.length; i++) {
      toastEmitter.emit(
        TOAST_EMITTER_KEY,
        'An error occurred: ' + error.response?.data?.errors[i]
      );
    }
  } else {
    toastEmitter.emit(
      TOAST_EMITTER_KEY,
      'An error occurred. Please check your network connection and try again.'
    );
  }
};

// This function sorts and focuses the first error field in the form and scrolls it into view
const focusFirstErrorField = (errorKeys, fieldPriority = []) => {
  if (!Array.isArray(errorKeys) || errorKeys.length === 0) return;

  const sortedKeys = fieldPriority.length
    ? [...errorKeys].sort(
        (a, b) => fieldPriority.indexOf(a) - fieldPriority.indexOf(b)
      )
    : errorKeys;

  const firstField = document.querySelector(`[name="${sortedKeys[0]}"]`);
  if (firstField) {
    firstField.focus({ preventScroll: true });
    firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const handleValidationError = ({
  error,
  formikRef,
  appearanceKeys,
  setActiveButton,
  fieldPriority,
}) => {
  const errors = error.inner.reduce((acc, curr) => {
    acc[curr.path] = curr.message;
    return acc;
  }, {});

  // Switch to Appearance tab if there are only appearance errors
  const errorKeys = Object.keys(errors);
  const hasOnlyAppearanceErrors = errorKeys.every((key) =>
    appearanceKeys.includes(key)
  );
  setActiveButton(hasOnlyAppearanceErrors ? 1 : 0);

  // Slight delay to allow component re-render
  setTimeout(() => {
    if (formikRef.current) {
      formikRef.current.setErrors(errors);
      formikRef.current.setTouched(
        errorKeys.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      focusFirstErrorField(errorKeys, fieldPriority);
    }
  }, 0);
};

export const onSaveTemplate = async ({
  data,
  schema,
  formikRef,
  appearanceKeys,
  setActiveButton,
  onSuccess,
  fieldPriority,
}) => {
  try {
    await schema.validate(data, { abortEarly: false });
    await onSuccess();
  } catch (validationError) {
    handleValidationError({
      error: validationError,
      formikRef,
      appearanceKeys,
      setActiveButton,
      fieldPriority,
    });
  }
};
