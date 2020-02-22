import request from '@/utils/request';
import getUserId from '@/utils/getUserId';

export async function listPage(data) {
  return request({
    url: '/api/exam/paperPlan/listPage',
    method: 'post',
    data: Object.assign(
      {
        planName: '',
        page: {
          pageNum: 1,
          pageSize: 10,
        },
      },
      data,
    ),
  });
}

export async function paperPlanUpdate(data) {
  return request({
    url: '/api/exam/paperPlan/delete',
    method: 'post',
    data,
  });
}




export async function listDetailPage(params) {
  return request({
    url: '/api/exam/paperPlan/detail',
    method: 'post',
    data: params,
  });
}

export async function getExamList(params) {
  return request({
    url: '/api/exam/paper/listPage',
    method: 'post',
    data:Object.assign(
      {
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        createStaffId: getUserId()
      },
      params
    )
  });
}

export async function departListAll (params) {
  return request({
    url:  '/api/sys/depart/listAll',
    method: 'post',
    data: params,
  })
}
export async function staffList (params) {
  return request({
    url:  '/api/sys/staff/list',
    method: 'post',
    data: Object.assign(
      {
        page:{
          pageNum:1,
          pageSize:10000
        },
        "staffId":"",
        "departId":"",
        "staffNo":"",
        "staffName":"",
        "sex":"",
        "staffType":"1",
        "state":"1"
      }
    ),
  })
}



export async function savePaperPlan (params) {
  return request({
    url:  '/api/exam/paperPlan/save',
    method: 'post',
    data: params,
  })
}

