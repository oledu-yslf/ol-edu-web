import request from '@/utils/request';

/**
 * 课程列表
 * @param {*} params 
 */
export async function listRecent (params) {
  return request('/api/course/listRecent',{
    method: 'POST',
    data: params,
  })
}



/**
 * 课程列表
 * @param {*} params 
 */
export async function courseListpage (params) {
  console.log(params);
  return request('/api/course/listpage',{
    method: 'POST',
    data: params,
  })
}
