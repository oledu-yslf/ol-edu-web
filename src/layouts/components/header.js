import React from 'react';
import { Menu, Button, Avatar, Col, Row } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import avtor from '@/assets/avtor.jpeg';

import styles from './header.css';
import Link from 'umi/link';
class OHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleInfo:{}
    }  
  }
  handleClick = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'global/save',
      payload: {
        selectedMenu: e.keyPath,
      },
    });
  };
  
  handleAvatarClick = e => {
    const {roleInfo} = this.state;
    if (roleInfo.staffType === '0' || roleInfo.staffType === '1') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  };
  handleLogoutClick = e => {
    localStorage.setItem('roleInfo','');
    localStorage.setItem('jwToken','');
    this.setState({
      roleInfo:{}
    })
  };
  componentWillMount() {
    let roleInfo = {};
    if(localStorage.getItem('roleInfo')){
      roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
    }else{
      roleInfo = ''
    }
    this.setState({
      roleInfo
    })
  }
  
  render(){
    const {roleInfo} = this.state;

    return (
      <Row className={styles.box}>
        <Col span={3}>
          <div className={styles.logo} />
        </Col>
        <Col span={17}>
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            className={styles.menu}
            selectedKeys={this.selectedMenu}
          >
            <Menu.Item key="index">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="/course">
              <Link to="/course">课程中心</Link>
            </Menu.Item>
            <Menu.Item key="/question">
              <Link to="/question">试题中心</Link>
            </Menu.Item>
            <Menu.Item key="/result">
              <Link to="/result">成绩中心</Link>
            </Menu.Item>
            <Menu.Item key="/task">
              <Link to="/task">作业中心</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={4}>
          {roleInfo ? (
            <div>
              <span style={{ marginRight: '10px' }}>Hi,{roleInfo.staffName}</span>
              <Button type="link" className={styles.right} onClick={this.handleLogoutClick}>
                退出
              </Button>
              <Button type="link" className={styles.right} onClick={this.handleAvatarClick}>
                <Avatar icon="user" src={avtor} />
              </Button>
            </div>
          ) : (
            <Button type="link" className={styles.right}>
              <Link to="/login">登录</Link>
            </Button>
          )}
        </Col>
      </Row>
    );
  }
  
}

export default connect(state => ({ ...state.global }))(OHeader);
