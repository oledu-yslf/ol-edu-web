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
      roleInfo: '',
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
    router.push(e.keyPath[0])
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
    sessionStorage.setItem('roleInfo', '');
    sessionStorage.setItem('jwToken', '');
    this.setState({
      roleInfo: '',
    });
  };
  componentWillMount() {
    let roleInfo = '';
    if (sessionStorage.getItem('roleInfo')) {
      roleInfo = JSON.parse(sessionStorage.getItem('roleInfo'));
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
        {roleInfo ? (
          <div className={styles.pullright}>
            <span style={{ marginRight: '5px' }}>Hi,{roleInfo.staffName}</span>
            <span style={{ marginRight: '5px' }}></span>
            <a href="/" >返回首页</a>
          </div>
        ) : (
         <div className={styles.pullright}>
          <a href="/login" >登录</a>
          </div>
        )}
      </div>
    );
  }

}

export default connect(state => ({ ...state.global }))(OMinHeader);
