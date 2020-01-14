import { Tabs, Row, Col, Spin } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import React from 'react';

import styles from './index.less';
import OTree from './components/tree';
import OList from './components/list';

const { TabPane } = Tabs;

class CourseManage extends React.Component {
  onTabClick = e => {
    router.push(e);
  };
  render() {
    const {loading} = this.props;
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="/teacher/courseManage" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/teacher"></TabPane>
          <TabPane tab="课程管理" key="/teacher/courseManage">
            <Spin spinning={loading}>
              <Row gutter={24}>
                <Col span={6}>
                  <OTree />
                </Col>
                <Col span={18}>
                  <OList />
                </Col>
              </Row>
            </Spin>
          </TabPane>
          <TabPane tab="试题管理" key="/teacher/questionList"></TabPane>
          <TabPane tab="试卷管理" key="/teacher/paperList"></TabPane>
          <TabPane tab="作业审阅" key="/teacher/homeworkForTeacherList"></TabPane>
          <TabPane tab="学生成绩" key="/teacher/resultList"></TabPane>
        </Tabs>
      </div>
    );
  }
}
export default connect(state => ({ loading: state.loading.models.courseManage }))(CourseManage);
