import { Tabs, Row, Col, Spin } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import React from 'react';

import styles from '@/style/common.less';
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

      </div>
    );
  }
}
export default connect(state => ({ loading: state.loading.models.courseManage }))(CourseManage);
