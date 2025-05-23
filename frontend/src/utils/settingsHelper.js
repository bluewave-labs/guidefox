import toastEmitter, { TOAST_EMITTER_KEY } from './toastEmitter';

export const handleNothingToUpdateProfile = (message) => {
  toastEmitter.emit(TOAST_EMITTER_KEY, message);
};

export const handleProfileUpdateSuccess = (response, updateProfile) => {
  const userData = response.data.user;

  // Emit toast notification
  if (response.status == 200) {
    updateProfile(userData);
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Profile updated successfully !');
  } else {
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Error updating profile !');
  }
};

export const handleGenericError = (message) => {
  toastEmitter.emit(TOAST_EMITTER_KEY, message);
};

export const handleEditOrgNameSuccess = (response, message) => {
  if (response.status == 200) {
    toastEmitter.emit(TOAST_EMITTER_KEY, message);
  } else {
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Error updating team name!');
  }
};

export const handleRemoveTeamMemberSuccess = (response, message) => {
  if (response.status == 200) {
    toastEmitter.emit(TOAST_EMITTER_KEY, message);
  } else {
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Error Removing Team Member');
  }
};

export const handleInviteMemberSuccess = (response, message) => {
  if (response.status == 200) {
    toastEmitter.emit(TOAST_EMITTER_KEY, message);
  } else {
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Error Inviting User');
  }
};

export const handleChangeRoleSuccess = (response, message) => {
  if (response.status == 200) {
    toastEmitter.emit(TOAST_EMITTER_KEY, message);
  } else {
    toastEmitter.emit(TOAST_EMITTER_KEY, 'Error Changing Role');
  }
};
