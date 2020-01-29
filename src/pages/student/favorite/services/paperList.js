import request from '@/utils/request';

export function listPage(params) {

  return request({
    url: '../api/course/listFavorite',
    method: 'POST',
    data: params
});
}
