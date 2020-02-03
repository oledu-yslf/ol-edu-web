import request from '@/utils/request';

export async function studentPaperDetailForSdt (params) {
  return request({
    url:  '/api/exam/paper/studentPaperDetailForSdt',
    method: 'post',
    data: params,
  })
}
