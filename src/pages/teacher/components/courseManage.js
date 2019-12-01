import React from 'react';
import { Row, Col } from 'antd';
import OTree from './tree';
import OList from './list';
import styles from './courseManage.less';

class CourseManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row gutter={24}>
        <Col span={6}>
          <OTree />
        </Col>
        <Col span={18}>
          <OList />
        </Col>
      </Row>
    );
  }
}

export default CourseManage;
