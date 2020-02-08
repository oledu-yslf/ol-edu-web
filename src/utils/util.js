
export function getStaffId() {
  const roleInfo = localStorage.getItem('roleInfo')
    ? JSON.parse(localStorage.getItem('roleInfo'))
    : '';
  const staffId = roleInfo.staffId || '';

  return staffId;
}
