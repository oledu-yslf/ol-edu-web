import { connect } from 'dva';
import styles from './index.less';
import ReactPlayer from 'react-player';
import { Row, Col, Rate } from 'antd';

const checkToken = url => {
  const jwToken = JSON.parse(localStorage.getItem('jwToken'));
  let token = `${jwToken.token_type} ${jwToken.access_token}`;
  return token;
};

function coursePlay(props) {
  const { courseDetail, url } = props;
  const { chapterVOList } = courseDetail;
  const chapterNode = item => {
    return (
      <div className={styles.cell} key={item.chapterId}>
        <div className="cell-title">
          <span>{item.chapterName}</span>
        </div>
        <div className="cell-body">{item.periodVOList.map(item => periodNode(item))}</div>
      </div>
    );
  };
  const handleClick = (item, e) => {
    const { dispatch } = props;
    dispatch({
      type: 'coursePlay/save',
      payload: {
        url: `/api${item.videoFileInfo.url}/${item.videoFileInfo.convertFileName}`,
      },
    });
  };
  const handleFavorite = () => {
    const { dispatch, courseId } = props;
    const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
    dispatch({
      type: 'coursePlay/favoriteSave',
      payload: {
        courseId,
        staffId: roleInfo.staffId,
        createStaffId: roleInfo.createStaffId,
      },
    }).then(res => {
      
    });
  };

  const periodNode = item => {
    return (
      <Row key={item.periodId} style={{ paddingLeft: '30px', height: '30px' }}>
        <Col span={20}>
          <span onClick={e => handleClick(item, e)} style={{ color: '#1890ff', cursor: 'pointer' }}>
            {item.periodName}
          </span>
        </Col>
        <Col span={4}>
          {item.attachFileInfo ? (
            <span style={{ color: '#1890ff', cursor: 'pointer' }}>
              {item.attachFileInfo.fileName}
            </span>
          ) : (
            ''
          )}
        </Col>
      </Row>
    );
  };

  return (
    <div className={styles.box}>
      <Row className={styles.nav}>
        <Col span={22}>
          <span>课程名称：{courseDetail.courseName}</span>
        </Col>
        <Col span={2}>
          <span style={{ fontSize: '16px' }}>
            收藏: <Rate allowHalf={false} count={1} onChange={handleFavorite} />
          </span>
        </Col>
      </Row>

      <div className={styles.video}>
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
                xhrSetup: function(xhr, url) {
                  xhr.setRequestHeader('Authorization', checkToken());
                },
              },
            },
          }}
        />
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
export default connect(state => ({
  ...state.coursePlay,
  loading: state.loading.models.coursePlay,
}))(coursePlay);
