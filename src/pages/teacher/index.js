import React from 'react';
import { Tabs, Descriptions } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const { TabPane } = Tabs;

class Teacher extends React.Component {
  onTabClick = e => {
    if (e === '基础资料') {
      router.push('/teacher');
    } else if (e === '课程管理') {
      router.push('/teacher/courseManage');
    }
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacher/save',
      payload: {},
    });
  }
  render() {
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="基础资料" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="基础资料">
            <Descriptions title="用户信息">
              <Descriptions.Item label="学号">Zhou Maomao</Descriptions.Item>
              <Descriptions.Item label="姓名">1810000000</Descriptions.Item>
              <Descriptions.Item label="性别">Hangzhou, Zhejiang</Descriptions.Item>
              <Descriptions.Item label="电话">empty</Descriptions.Item>
              <Descriptions.Item label="出生日期">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
              <Descriptions.Item label="地址">Zhou Maomao</Descriptions.Item>
              <Descriptions.Item label="院系">1810000000</Descriptions.Item>
              <Descriptions.Item label="邮箱">Hangzhou, Zhejiang</Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="课程管理" key="课程管理"></TabPane>
        </Tabs>
      </div>
    );
  }
}
export default Teacher;
