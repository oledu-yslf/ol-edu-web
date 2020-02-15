import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperresultsum/listPage',
    method: 'post',
    data: params,
  });
}

export async function getPlanAndPaperList() {
  return request({
    url: '/api/exam/paperresultsum/getPlanAndPaperList',
    method: 'post',
    data:{}
  });
}

export async function departListAll (params) {
  return request({
    url:  '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  })
}
