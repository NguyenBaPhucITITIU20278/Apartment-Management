export const formatAddress = (address) => {
  if (!address) return '';
  return address.replace(/,/g, '').replace(/\s+/g, '_');
}; 