import React from 'react';
import style from '@/style/common.less';
import { Tabs, Card, List,Form,AutoComplete,Button ,Spin} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import getUserId from '@/utils/getUserId';

const { TabPane } = Tabs;
const { Option } = AutoComplete;

class RecentList extends React.Component {

  componentWillMount() {
    const { dispatch } = this.props;
    let staffId = getUserId();
    dispatch({
      type: 'recentList/listRecent',
      payload:{
        courseName:'',
        createStaffId:staffId,
      }
    });
  }

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
    const { courseName } = value;
    dispatch({
      type: 'recentList/listRecent',
      payload: {
        courseName,
        createStaffId:getUserId(),
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch,form } = this.props;
    const value = form.getFieldsValue();
    const { courseName } = value;
    dispatch({
      type: 'recentList/listRecent',
      payload: {
        courseName,
        createStaffId:getUserId(),
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };
  render() {
    const { loading,list, total ,form,courseList} = this.props;
    const { getFieldDecorator } = form;
    const courseNode = courseList.map(item => <Option key={item.courseId}>{item.courseName}</Option>);

    return (
      <div className={style.box}>
        <Form layout="inline" style={{marginBottom:'20px'}}>
          <Form.Item label="课程名称:">
            {getFieldDecorator('courseName', {
            })(
              <AutoComplete
                dataSource={courseNode}
                //onSearch={this.onCourseSearch}
                placeholder="请输入课程名称"
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
          loading={loading || false}
          grid={{ gutter: 16, column: 4 }}
          dataSource={list}
          pagination={{
            total,
            pageSize: 10,
            onChange: (page,pageSize) => {
              this.pageChange(page,pageSize);
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
      </div>
    );
  }
}

const RecentListForm = Form.create({ name: 'RecentListForm' })(RecentList);

export default connect(state => ({
  ...state.recentList,
  loading: state.loading.models.recentList,
}))(RecentListForm);
