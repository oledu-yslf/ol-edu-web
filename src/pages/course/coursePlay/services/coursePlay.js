import request from '@/utils/request';

/**
 * 课程详情
 * @param {*} params 
 */
export function courseDetail (data) {
  return request('../api/course/detail',{
    method: 'POST',
    data
  })
}

/**
 * 课程详情
 * @param {*} params 
 */
export function favoriteSave (data) {
  return request('../api/course/favorite/save',
  {
    method: 'POST',
    data
  })
}

/**
 * 更新用户学习课程
 * @param {*} params 
 */
export function studySave (data) {
  return request('../api/course/study/save',
  {
    method: 'POST',
    data
  })
}
