import React from 'react';
import style from './index.less';
import { Card, List, Input,Tabs,Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

class Index extends React.Component {
  handleClick = (item, e) => {
    window.open(`/course/coursePlay?courseId=${item.courseId}`);
  };
  onTabClick = e => {
    router.push(e);
  };
  pageChange = (page, pageSize) => {
    const { courseName, dispatch } = this.props;
    const roleInfo = localStorage.getItem('roleInfo')
      ? JSON.parse(localStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo.staffId || '';
    dispatch({
      type: 'favoriteList/listPage',
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
    const roleInfo = localStorage.getItem('roleInfo')
      ? JSON.parse(localStorage.getItem('roleInfo'))
      : '';
    const staffId = roleInfo.staffId || '';
    dispatch({
      type: 'favoriteList/listPage',
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
    const { list, total, loading } = this.props;
    return (
      <div className={style.box}>
        <Tabs defaultActiveKey="/student/favorite" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/student"></TabPane>
          <TabPane tab="学习记录" key="/student/recentList"></TabPane>
          <TabPane tab="我的作业" key="/student/homeworkForStudent"></TabPane>
          <TabPane tab="我的收藏" key="/student/favorite"></TabPane>
          <TabPane tab="修改密码" key="/student/changePsw"></TabPane>
        </Tabs>
        <Row>
          <Col span={8} offset={16}>
            <Search
              placeholder="请输入课程名称"
              onSearch= { this.searchCourse }
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        {localStorage.getItem('jwToken') && !loading ? (
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
      </div>
    );
  }
}

export default connect(state =>(
  {
  ...state.favoriteList,
  loading: state.loading.models.favoriteList
}))(Index);
