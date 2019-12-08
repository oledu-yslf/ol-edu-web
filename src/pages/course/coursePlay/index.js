import React from 'react';
import { connect, router } from 'dva';
import styles from './index.less';
import ReactPlayer from 'react-player';
import { Rate } from 'antd';

const checkToken = () => {
  const jwToken = JSON.parse(localStorage.getItem('jwToken'));
  let token = `${jwToken.token_type} ${jwToken.access_token}`;
  return token;
};
const computerTime =(dur) =>{
  var m = parseInt(dur/60);
  var s = parseInt(dur%60) || '00';
  return `${m}:${s}`

}

class coursePlay extends React.Component {
  handleClick = (item, e) => {
    const { dispatch } = this.props;
    if(!localStorage.getItem('roleInfo')){
      router.push('/login');
      return;
    }
    if(item.videoFileInfo){
      dispatch({
        type: 'coursePlay/save',
        payload: {
          url: `/api${item.videoFileInfo.url}/${item.videoFileInfo.convertFileName}`,
        },
      });
    }else if(item.videoFileInfo){
      window.open(`/api${item.attachFileInfo.url}/${item.videoFileInfo.fileName}`)
    }else{

    }
  };
  handleFavorite = () => {
    const { dispatch, courseId } = this.props;
    let roleInfo;
    if(localStorage.getItem('roleInfo')){
      roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
    }else{
      router.push('/login');
      return;
    }
    dispatch({
      type: 'coursePlay/favoriteSave',
      payload: {
        courseId,
        staffId: roleInfo.staffNo,
        createStaffId: roleInfo.staffNo
      },
    }).then(res => {
      dispatch({
        type: 'coursePlay/courseDetail',
        payload: {
          courseId
        },
      })
    });
  };

  render() {
    const { courseDetail, url } = this.props;
    const { courseName,chapterVOList, countStudy,logoFile,favorites } = courseDetail;
    const star = favorites?1:0
    const chapterNode = item => {
      return (
        <div className={styles.cell} key={item.chapterId}>
          <div className="cell-title">
            <span>{item.chapterName}</span>
          </div>
          <div className="cell-body">
            {item.periodVOList ? item.periodVOList.map(item => periodNode(item)) : ''}
          </div>
        </div>
      );
    };
    const periodNode = item => {
      return (
        <div
          key={item.periodId}
          style={{ paddingLeft: '30px', height: '30px' }}
          className="clearfix"
        >
          <div className={styles.pullleft}>
            <span
              onClick={e => this.handleClick(item, e)}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {item.periodName}
            </span>
            <span style={{marginLeft:'20px'}}>
            {(item.videoFileInfo?((`时长:${computerTime(item.videoFileInfo.duration)}`)):'')}
            </span>
          </div>
          <div className={styles.pullright} onClick={e=>this.handleDownLoad(item,e)}>
            {item.attachFileInfo ? (
              <a download style={{ color: '#1890ff', cursor: 'pointer' }} href={`/api${item.attachFileInfo.url}/${item.attachFileInfo.fileName}`}>
                {item.attachFileInfo.fileName}
              </a>
            ) : (
              ''
            )}
          </div>
        </div>
      );
    };
    return (
      <div className={styles.box}>
        <div className={[styles.nav, 'clearfix'].join(' ')}>
          <div className={styles.pullleft}>
            <span>课程名称：{courseName}</span>
          </div>
          <div className={styles.pullright}>
            <span style={{ fontSize: '16px',marginRight:'20px' }}>学习人数:{countStudy}</span>
            <span style={{ fontSize: '16px' }}>
              收藏: <Rate allowHalf={false} count={1} value={star} onChange={this.handleFavorite} />
            </span>
          </div>
        </div>

        <div className={styles.video}>
          {url ? (
            <ReactPlayer
              width="100%"
              height="540px"
              url={url}
              playing
              controls={true}
              config={{
                file: {
                  hlsOptions: {
                    forceHLS: true,
                    debug: false,
                    xhrSetup: function(xhr) {
                      xhr.setRequestHeader('Authorization', checkToken());
                    },
                  },
                },
              }}
            />
          ) : ''
        }
        {
          !url&&logoFile?(<img style={{width:'1200px'}} src={`/api${logoFile.url}/${logoFile.fileName}`} alt=""></img>):''
        }
        </div>
        <div className={styles.cell}>
          <div className="cell-title">
            <span>课程简介:{courseDetail.introduce}</span>
          </div>
        </div>

        {chapterVOList ? chapterVOList.map(item => chapterNode(item)) : ''}
      </div>
    );
  }
}
export default connect(state => ({
  ...state.coursePlay,
  loading: state.loading.models.coursePlay,
}))(coursePlay);
