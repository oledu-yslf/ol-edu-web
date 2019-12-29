export default function getUserId() {
  const roleInfo = localStorage.getItem('roleInfo')
    ? JSON.parse(localStorage.getItem('roleInfo'))
    : '';
  const modifyStaffId = roleInfo.staffId || '';
  return modifyStaffId;
}
