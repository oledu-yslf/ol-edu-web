import style from './index.less';
import { Card, Divider, Icon, Col, Row } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

function index(props) {
  const { recentList, newList, hotList } = props;
  const handleClick = (item, e) => {
    router.push({
      pathname: '/course/coursePlay',
      query: {
        courseId: item.courseId,
      },
    });
  };
  const ListNode = type => {
    const list = type === 1 ? recentList : type === 2 ? newList : hotList;
    return (
      <Card
        title={
          <div>
            <Divider type="vertical" className={style.divider} />
            {type === 1 ? '最近学习课程' : type === 2 ? '最新课程' : '热门课程'}
          </div>
        }
        bordered={false}
        extra={
          <Link to="/course">
            更多课程
            <Icon type="right" />
          </Link>
        }
        className={style.card}
      >
        <Row gutter={16}>
          {list.length > 0
            ? list.map(item => (
                <Col span={6} key={item.courseId} onClick={e => handleClick(item, e)}>
                  <Card
                    hoverable
                    cover={
                      <img
                        style={{ width: '100%', height: '160px' }}
                        alt="logo"
                        src={`/api/${item.logoFile.url}/${item.logoFile.fileName}`}
                      />
                    }
                  >
                    <Card.Meta title={item.courseName} />
                  </Card>
                </Col>
              ))
            : ''}
        </Row>
      </Card>
    );
  };
  return (
    <div className={style.box}>
      {recentList.length > 0 ? ListNode(1) : ''}
      {newList.length > 0 ? ListNode(2) : ''}
      {hotList.length > 0 ? ListNode(3) : ''}
    </div>
  );
}

export default connect(state => ({ ...state.index, loading: state.loading.models.index }))(index);
