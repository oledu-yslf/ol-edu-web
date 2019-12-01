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
