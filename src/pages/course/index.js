import { connect } from 'dva';
import { List, Card, Divider, Col, Row, Pagination, Empty } from 'antd';
import OSearchBar from './components/OSearchBar';
import router from 'umi/router';

import styles from './index.less';

const pageSize = 20;

function course(props) {
  const { list, total, dispatch, loading } = props;
  const searchCourse = value => {
    dispatch({
      type: 'course/save',
      payload: {
        ...value,
      },
    });
    dispatch({
      type: 'course/courseListpage',
      payload: {
        ...value,
        page: {
          pageSize,
          pageNum: 1,
        },
      },
    });
  };
  const pageChange = (page, pageSize) => {
    dispatch({
      type: 'course/save',
      payload: {
        pageNum: page,
      },
    });
    dispatch({
      type: 'course/courseListpage',
      payload: {
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };

  const handleClick = (item, e) => {
    window.open(`/course/coursePlay?courseId=${item.courseId}`);
  };

  return (
    <div className={styles.box}>
      <OSearchBar onSearch={searchCourse} />
      <Divider />
      <List
        grid={{gutter:16, column: 4}}
        dataSource={list}
        pagination={{
          total,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            pageChange(page, pageSize);
          },
        }}

        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              onClick={e=>handleClick(item,e)}
              cover={
                <img
                  style={{ width: '100%', height: '160px' }}
                  alt="logo"
                  src={item.logoFile? (`/api/${item.logoFile.url}/${item.logoFile.fileName}`):''}
                />
              }
            >
              <Card.Meta title={item.courseName} />
            </Card>
          </List.Item>
        )}
      />


    </div>
  );
}
export default connect(state => ({ ...state.course, loading: state.loading.models.course }))(
  course,
);
