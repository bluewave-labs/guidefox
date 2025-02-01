export const getFileExtension = (selectedFile) => {
  if (selectedFile) {
    const fileName = selectedFile.name;
    const extension = fileName.split('.').pop().toUpperCase();
    return extension;
  }
  return null;
};

export const formatFileSize = (sizeInBytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let fileSize = sizeInBytes;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
};

export const getFullName = (userData) => {
  if (userData) {
    return userData?.surname
      ? `${userData.name} ${userData.surname}`
      : userData.name;
  } else {
    return null;
  }
};

export const generateApiKey = () => {
  const length = 32; // Define the length of the API key
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Characters to use
  let apiKey = '';

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    apiKey += charset[array[i] % charset.length];
  }

  return apiKey;
};

// Authorization utility function
export function renderIfAuthorized(userRole, requiredRole, element) {
  if (!userRole || !requiredRole) return null;
  return userRole === requiredRole ? element : null;
}
