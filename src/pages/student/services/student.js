import request from '@/utils/request';


/**
 * 获取员工信息
 * @param {*} params 
 */
export async function staffDetail (params) {
  return request('/api/sys/staff/detail',{
    method: 'POST',
    data: params,
  })
}

/**
 * 更新员工信息
 * @param {*} params 
 */
export async function staffUpdate (params) {
  return request('/api/sys/staff/update',{
    method: 'POST',
    data: params,
  })
}
