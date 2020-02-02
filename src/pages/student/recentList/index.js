import React from 'react';
import style from './index.less';
import { Tabs, Card, List,Form,AutoComplete,Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import getUserId from '@/utils/getUserId';

const { TabPane } = Tabs;
const { Option } = AutoComplete;

class RecentList extends React.Component {
  onTabClick = e => {
    router.push(e);
  };
  handleClick = (item, e) => {
    window.open(`/course/coursePlay?courseId=${item.courseId}`);
  };
  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { courseId } = value;
    dispatch({
      type: 'recentList/listRecent',
      payload: {
        courseId,
        createStaffId:getUserId(),
      },
    });
  };

  onCourseSearch = searchText => {
    const {dispatch} = this.props;
    dispatch({
      type:'recentList/courseListpage',
      payload:{
        courseName:searchText
      }
    })
  };

  pageChange = (page, pageSize) => {
    const { dispatch,form } = this.props;
    const value = form.getFieldsValue();
    const { courseId } = value;
    dispatch({
      type: 'recentList/listRecent',
      payload: {
        courseId,
        createStaffId:getUserId(),
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };
  render() {
    const { list, total ,form,courseList} = this.props;
    const { getFieldDecorator } = form;
    const courseNode = courseList.map(item => <Option key={item.courseId}>{item.courseName}</Option>);

    return (
      <div className={style.box}>
        <Tabs defaultActiveKey="/student/recentList" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/student"></TabPane>
          <TabPane tab="学习记录" key="/student/recentList">
            <Form layout="inline" style={{marginBottom:'20px'}}>
              <Form.Item label="课程名称:">
                {getFieldDecorator('courseId', {
                  rules: [{ required: true, message: '请输入课程名称！' }],
                })(
                  <AutoComplete
                    dataSource={courseNode}
                    onSearch={this.onCourseSearch}
                    placeholder="input here"
                  >
                    {courseNode}
                  </AutoComplete>,
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  onClick={this.handleSearchSubmit}
                >
                  查询
                </Button>
              </Form.Item>
            </Form>
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
          </TabPane>
          <TabPane tab="我的作业" key="/student/homeworkForStudent"></TabPane>
          <TabPane tab="我的收藏" key="/student/favorite"></TabPane>
          <TabPane tab="修改密码" key="/student/changePsw"></TabPane>
        </Tabs>
      </div>
    );
  }
}

const RecentListForm = Form.create({ name: 'RecentListForm' })(RecentList);

export default connect(state => ({
  ...state.recentList,
  loading: state.loading.models.recentList,
}))(RecentListForm);
