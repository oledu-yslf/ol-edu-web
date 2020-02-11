
export function getStaffId() {
  const roleInfo = sessionStorage.getItem('roleInfo')
    ? JSON.parse(sessionStorage.getItem('roleInfo'))
    : '';
  const staffId = roleInfo.staffId || '';

  return staffId;
}
