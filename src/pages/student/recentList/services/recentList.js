import request from '@/utils/request';

/**
 * 课程列表
 * @param {*} params
 */
export async function listRecent(params) {
  return request('/api/course/listRecent', {
    method: 'POST',
    data: Object.assign(
      {
        createStaffId: '',
        courseId: '',
        page: {
          pageNum: 1,
          pageSize: 12,
        },
      },
      params,
    ),
  });
}

export async function courseListpage (params) {
  return request('/api/course/listpage',{
    method: 'POST',
    data: Object.assign(
      {
        courseName: '',
        page: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      params,
    ),
  })
}

