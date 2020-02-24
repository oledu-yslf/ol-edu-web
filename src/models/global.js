import * as service from '@/services/index';
import router from 'umi/router';

export default {
  namespace: 'global',
  state: {
    selectedMenu: ['/']
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen(({pathname, query}) => {
        //console.log(pathname);
        getWebMenu()
          .then((res) => {
            //成功，
            if (res.code === 200) {
              let data = res.data;
              for (var i = 0, len = data.length; i < len; i++) {
                //这些菜单需要进行权限控制。

                //console.log(data[i].menuUrl);
                //往后台发送指令，让后台判断是否有权限。
                if (pathname == data[i].menuUrl) {

                  //console.log("=========");
                  checkUrlPermission({url: data[i].menuUrl}).then((res) => {
                    if (res.code === 200) {

                    } else {
                      console.warn(res.msg);
                      router.push('/');
                      return;
                    }
                  })

                  return;
                }
              }

            }
            //不成功不进行渲染
          })
          .catch((e) => {
            console.warn(e);
          });

        //设置初始化选中的菜单
        let selectedMenu = [];
        selectedMenu[0] = pathname;
        dispatch({
          type: 'save',
          payload: {
            selectedMenu
          }
        })

      });
    },
  },
  effects: {
    *queryLogo({ payload }, { call, put ,select}){
      const {data} = yield call(service.queryLogo);

      yield put({
        type: 'save',
        payload: {
          logoFileInfo: data,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },
};


async function getWebMenu() {
  let res = await service.getWebMenu({});

  return res;
}

async function checkUrlPermission(param) {
  return await service.checkUrlPermission(param);
}

function GetUrlRelativePath() {
  var url = window.location.href;
  var arrUrl = url.split("//");

  var start = arrUrl[1].indexOf("/");
  var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

  if (relUrl.indexOf("?") != -1) {
    relUrl = relUrl.split("?")[0];
  }


  return relUrl;
}
