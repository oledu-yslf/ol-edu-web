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
        page: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      params,
    ),
  });
}


