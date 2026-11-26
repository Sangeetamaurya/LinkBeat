// The picked photo is sent to the backend as a small image inside the request ("data uri"),
// because a file path on this phone means nothing to the server or to other devices.
export function avatarFromAsset(asset) {
  if (asset.base64) return 'data:' + (asset.mimeType || 'image/jpeg') + ';base64,' + asset.base64;
  return asset.uri;
}

export const AVATAR_PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.4,
  base64: true,
};
