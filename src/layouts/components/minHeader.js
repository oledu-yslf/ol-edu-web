import React from 'react';
import { Menu, Button, Avatar } from 'antd';
import styles from './minHeader.css';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import avtor from '@/assets/avtor.jpeg';

class OMinHeader extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      roleInfo: {},
    };
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
    localStorage.setItem('roleInfo', '');
    localStorage.setItem('jwToken', '');
    this.setState({
      roleInfo: '',
    });
  };
  componentWillMount() {
    let roleInfo = '';
    if (localStorage.getItem('roleInfo')) {
      roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
    } else {
      roleInfo = '';
    }
    this.setState({
      roleInfo,
    });
  }

  render(){
    const { roleInfo } = this.state;
    const {selectedMenu} = this.props;
    return (
      <div className={[styles.box,'clearfix'].join(' ')}>
        <div className={styles.logo} />
        <Menu
          onClick={this.handleClick}
          mode="horizontal"
          className={styles.menu}
          selectedKeys={selectedMenu}
        >
          <Menu.Item key="/">
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
        {roleInfo ? (
          <div className={styles.pullright}>
            <span style={{ marginRight: '10px' }}>Hi,{roleInfo.staffName}</span>
            <Button type="link" onClick={this.handleLogoutClick}>
                退出
              </Button>
            <Button type="link" className={styles.right} onClick={this.handleAvatarClick}>
              <Avatar icon="user" src={avtor} />
            </Button>
          </div>
        ) : (
          <Button type="link" className={styles.pullright}>
            <Link to="/login">登录</Link>
          </Button>
        )}
      </div>
    );
  }
  
}

export default connect(state => ({ ...state.global }))(OMinHeader);
