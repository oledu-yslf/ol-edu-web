import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(params) {
  return request({
    url: '/api/exam/paperPlanDetail/getAvgDetailForTeacher',
    method: 'post',
    data: params,
  })
}

export async function getStudentList(params) {
  let newParam = {};
  newParam = {...params}
  newParam.page = {
    pageNum: 1,
    pageSize: 9999999,
  }
  return request({
    url: '/api/exam/paperPlanDetail/getAvgDetailForTeacher',
    method: 'post',
    data:newParam,
  })
}


export async function avgDetailExport(params) {
  return request({
    url: '/api/exam/paperPlanDetail/avgDetailExport',
    method: 'post',
    data: params,
    responseType : 'blob', // 必须注明返回二进制流
  });
}
