import React from 'react';
import { Menu, Button, Avatar,Divider,Row,Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './footer.css';


class OFooter extends React.Component {

  render() {

    return <div className={styles.footer}>
      <Row>
        <Col span={4} offset={6}>
          <h3>关于我们</h3>
          <ul>
            <li>公司介绍</li>
            <li>联系我们</li>
            <li>法律条款</li>
            <li>免责声明</li>
          </ul>
        </Col>
        <Col span={4} >
          <h3>友情链接</h3>
          <ul>
            <li>某某网校</li>
            <li>某某门户</li>
            <li>某某名师</li>
          </ul>
        </Col>

        <Col span={8} >
          <h3>客服热线</h3>
          <ul>
            <li><h3>400-008-0263</h3></li>
            <li>(周一至周日 9:00-18:00 )</li>
          </ul>
        </Col>

      </Row>
      <div>
        <div className={styles.policeBox}>
          <div  className={styles.policetelBox}>
            北京银石立方科技有限公司
            <br></br>
            统一社会信用代码：91350206MA2XN2XQ4A 软件企业证书：厦RQ-2017-0034 软件产品证书：厦RQ-2017-0005
          </div>
        </div>
      </div>
    </div>
  }
}


export default connect(state => ({ ...state.global }))(OFooter);
