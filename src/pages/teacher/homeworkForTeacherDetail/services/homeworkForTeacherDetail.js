import request from '@/utils/request';

export async function studentPaperDetailForThr (params) {
  return request({
    url:  '/api/exam/paper/studentPaperDetailForThr',
    method: 'post',
    data: params,
  })
}
