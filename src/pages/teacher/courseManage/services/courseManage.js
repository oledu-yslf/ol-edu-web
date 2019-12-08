import request from '@/utils/request';



/**
 * 查询课程分类
 * @param {*} params 
 */
export function categoryListAll (params) {
  return request('../api/course/category/listAll',{
    method: 'POST',
    data: params,
  })
}

/**
 * 新增课程分类
 * @param {*} params 
 */
export function categorySave (params) {
  return request('../api/course/category/save', {
    method: 'POST',
    data: params,
  })
}

/**
 * 修改课程分类
 * @param {*} params 
 */
export function categoryUpdate (params) {
  return request('../api/course/category/update',{
    method: 'POST',
    data: params,
  })
}

/**
 * 删除课程分类
 * @param {*} params 
 */
export function categoryDelete (params) {
  return request('../api/course/category/delete',{
    method: 'POST',
    data: params
  })
}

/**
 * 课程列表
 * @param {*} params 
 */
export async function courseListpage (params) {
  return request('../api/course/listpage',{
    method: 'POST',
    data: params,
  })
}

/**
 * 课程编辑
 * @param {*} params 
 */
export function courseUpdate (params) {
  return request('../api/course/update',{
    method: 'POST',
    data: params,
  })
}

/**
 * 删除课程
 * @param {*} params 
 */
export async function courseDelete (params) {
  return request('../api/course/delete',{
    method: 'POST',
    data: params,
  })
}
