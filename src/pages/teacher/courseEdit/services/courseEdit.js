import request from '@/utils/request';

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

/**
 * 课程新增
 * @param {*} params 
 */
export function courseSave (params) {
  return request('../api/course/save',{
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
 * 课程详情
 * @param {*} params 
 */
export function courseDetail (params) {
  return request('../api/course/detail',{
    method: 'POST',
    data:params,
  })
}



