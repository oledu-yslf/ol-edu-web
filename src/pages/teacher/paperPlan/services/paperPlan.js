import request from '@/utils/request';

export async function listPage (data) {
  return request({
    url:  '/api/exam/paperPlan/listPage',
    method: 'post',
    data:Object.assign({
      planName:'',
      page:{
        pageNum:1,
        pageSize:10
      }
    },data)
  })
}
