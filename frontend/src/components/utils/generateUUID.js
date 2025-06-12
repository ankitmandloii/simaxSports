export function generateUUID() {
  return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// export const getTrackingMetadata = () => {
//   let anonId = localStorage.getItem('anon_id');
//   if (!anonId) {
//     anonId = generateUUID();
//     localStorage.setItem('anon_id', anonId);
//   }

//   return {
//     anonId,
//     userAgent: navigator.userAgent,
//     language: navigator.language,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     screen: `${window.screen.width}x${window.screen.height}`,
//     platform: navigator.platform,
//   };
// };