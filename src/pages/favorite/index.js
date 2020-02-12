import React from 'react';
import style from '@/style/common.less';
import { Card, List, Input,Tabs,Row, Col,Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import * as Util from '@/utils/util'

class Favorite extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    let staffId = Util.getStaffId();
    dispatch({
      type: 'favorite/init',
      payload:{
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        courseName:'',
        createStaffId:staffId,
      }
    });
  }

  handleClick = (item, e) => {
    window.open(`/course/coursePlay?courseId=${item.courseId}`);
  };
  onTabClick = e => {
    router.push(e);
  };
  pageChange = (page, pageSize) => {
    const { courseName, dispatch } = this.props;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo.staffId || '';
    dispatch({
      type: 'favorite/listPage',
      payload: {
        courseName,
        createStaffId:staffId,
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };
  searchCourse = value => {
    debugger
    const { dispatch } = this.props;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo.staffId || '';
    dispatch({
      type: 'favorite/listPage',
      payload: {
        createStaffId:staffId,
        courseName: value,
        page: {
          pageSize:10,
          pageNum: 1,
        },
      },
    });
  };
  render() {
    const { Search } = Input;
    const { TabPane } = Tabs;
    const { list, total,loading } = this.props;
    return (
      <div className={style.box}>

        <Row>
          <Col span={8} offset={16}>
            <Search
              placeholder="请输入课程名称"
              onSearch= { this.searchCourse }
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Spin tip="Loading..." spinning={loading || false}>
        {sessionStorage.getItem('jwToken') && !loading ? (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={list}
            pagination={{
              total,
              pageSize: 10,
              onChange: page => {
                this.pageChange(page);
              },
            }}
            renderItem={item => (
              <List.Item>
                <Card
                  style={{ marginTop: '20px' }}
                  hoverable
                  onClick={e => this.handleClick(item, e)}
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
        ) : (
          ''
        )}

        </Spin>
      </div>
    );
  }
}

export default connect(state =>(
  {
  ...state.favorite,
  loading: state.loading.models.favorite
}))(Favorite);
