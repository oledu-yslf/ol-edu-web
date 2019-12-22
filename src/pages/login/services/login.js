import request from '@/utils/request';
import qs from 'qs'

/**
 * 获取token
 * @param {*} params 
 */
export async function token (params) {
  return request('/api/oauth/token',{
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=utf-8",
      "Authorization": ''
    },
    method: 'POST',
    data: qs.stringify(Object.assign(params,{
      client_id:'client_2',
      client_secret:123,
      grant_type:'password',
      scope:'all'
    })),
  })
}


/**
 * 获取用户信息
 * @param {*} params 
 */
export async function loadUserByUserName (params) {
  return request('/api/sys/loadUserByUserName',{
    method: 'POST',
    data: params,
  })
}
