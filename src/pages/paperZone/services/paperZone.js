import request from '@/utils/request';

export async function getZone(params) {
  return request({
    url:  '/api/exam/paperPlanZone/getZone',
    method: 'post',
    data: params,
  })
}
