import React from 'react';
import {Menu, Button, Avatar, Divider, Row, Col,Descriptions } from 'antd';
import router from 'umi/router';
import {connect} from 'dva';
import styles from './footer.css';


class OFooter extends React.Component {

  render() {

    return (
      <div className={styles.footer}>
        <div className={styles.footerHeader}></div>
        <Row className={styles.footerRows}>
          <Col span={12} offset={5}>
            <Descriptions colum="4" className={styles.footerDesc}>
              <Descriptions.Item label="地址" span={4}>
                <label>北京市大兴区星光视界中心1A座501室</label>
              </Descriptions.Item>
              <Descriptions.Item label="电话" span={2}><label>010-56455068</label></Descriptions.Item>
              <Descriptions.Item label="传真" span={2}><label>010-56455068</label></Descriptions.Item>
              <Descriptions.Item label="邮箱" span={2}><label>296509378@qq.com</label></Descriptions.Item>
              <Descriptions.Item label="QQ"  span={2}><label>296509378</label></Descriptions.Item>

            </Descriptions>
          </Col>

          <Col span={4}>
            <div className={styles.footerimageweixin}></div>
          </Col>
        </Row>
      </div>
    )
  }
}


export default connect(state => ({...state.global}))(OFooter);
