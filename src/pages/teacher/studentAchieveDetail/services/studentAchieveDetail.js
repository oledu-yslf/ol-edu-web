import request from '@/utils/request';

export async function studentPaperDetailForThr (params) {
  return request({
    url:  '/api/exam/paper/studentPaperDetailForThr',
    method: 'post',
    data: params,
  })
}

export async function staffDetail (params) {
  return request({
    url:  '/api/sys/staff/detail',
    method: 'post',
    data: params,
  })
}
