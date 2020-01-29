import request from '@/utils/request';

/**
 * 更新员工信息
 * @param {*} params
 */
export async function staffUpdate (params) {
  return request('/api/sys/staff/updatePwd',{
    method: 'POST',
    data: params,
  })
}
