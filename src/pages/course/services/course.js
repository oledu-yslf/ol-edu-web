import request from '@/utils/request';

/**
 * 课程列表
 * @param {*} params 
 */
export async function courseListpage (params) {
  return request('/api/course/listpage',{
    method: 'POST',
    data: params,
  })
}

/**
 * 课程节点
 * @param {*} params 
 */
export function categoryListAll (params) {
  return request('../api/course/category/listAll',{
    method: 'POST',
    data: params,
  })
}
