import request from '@/utils/request';

export async function listPage (data) {
  return request({
    url:  '/api/exam/paperPlanDetail/getPaperPlanDetail',
    method: 'post',
    data:Object.assign({
      planId:'',paperName:'',
      page:{
        pageNum:1,
        pageSize:10
      }
    },data)
  })
}

