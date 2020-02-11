export default function getUserId() {
  const roleInfo = sessionStorage.getItem('roleInfo')
    ? JSON.parse(sessionStorage.getItem('roleInfo'))
    : '';
  const modifyStaffId = roleInfo.staffId || '';
  return modifyStaffId;
}
