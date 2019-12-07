import request from '@/utils/request';
import qs from 'qs';

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

/**
 * 章节列表
 * @param {*} params 
 */
export function chapterList (params) {
  return request('../api/course/chapter/list',{
    method: 'POST',
    data:params.id
  })
}

/**
 * 章节新增
 * @param {*} params 
 */
export function chapterSave (data) {
  return request('../api/course/chapter/save',{
    method: 'POST',
    data
  })
}

/**
 * 章节更新
 * @param {*} params 
 */
export function chapterUpdate (data) {
  return request('../api/course/chapter/update',{
    method: 'POST',
    data
  })
}

/**
 * 章节详情
 * @param {*} params 
 */
export function chapterDetail (params) {
  return request('../api/course/chapter/detail',{
    method: 'POST',
    data:{chapterId:params.id}
  })
}

/**
 * 章节删除
 * @param {*} params 
 */
export function chapterDelete (params) {
  return request('../api/course/chapter/delete',{
    method: 'POST',
    data:params
  })
}



/**
 * 课时列表
 * @param {*} params 
 */
export async function periodList (data) {
  return request('../api/course/chapter/period/list',{
    method: 'POST',
    data:data.chapterId
  })
}


/**
 * 课时新增
 * @param {*} params 
 */
export async function periodSave (data) {
  return request('../api/course/chapter/period/save',{
    method: 'POST',
    data
  })
}

/**
 * 课时更新
 * @param {*} params 
 */
export async function periodUpdate (data) {
  return request('../api/course/chapter/period/update',{
    method: 'POST',
    data
  })
}

/**
 * 课时更新
 * @param {*} params 
 */
export async function periodDetail (data) {
  return request('../api/course/chapter/period/detail',{
    method: 'POST',
    data:data.id
  })
}

/**
 * 课时更新
 * @param {*} params 
 */
export async function periodDelete (data) {
  return request('../api/course/chapter/period/delete',{
    method: 'POST',
    data:data.id
  })
}




