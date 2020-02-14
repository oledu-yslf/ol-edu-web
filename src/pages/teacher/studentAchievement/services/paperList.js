import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperresultsum/listPage',
    method: 'post',
    data: Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        paperId: '',
        planId:'',
        departId:'',
        orderBy:'average_score asc,highest_score asc,minimum_score asc,pass_num asc,pass_percent asc'
      },
      params,
    ),
  });
}
