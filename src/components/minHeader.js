import React from 'react';
import { Menu, Button, Avatar } from 'antd';
import styles from './minHeader.css';
import router from 'umi/router';
import { connect } from 'dva';

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

    //获取logo信息
    const {dispatch} = this.props;

    dispatch({
      type: 'global/queryLogo',
    });

  }

  render(){
    const { roleInfo } = this.state;
    const {selectedMenu,logoFileInfo} = this.props;

    let imageUrl = '';
    if (logoFileInfo) {
      imageUrl = `/api${logoFileInfo.url}\/${logoFileInfo.fileName}`;
    }


    return (
      <div className={[styles.box, 'clearfix'].join(' ')} style={{width: '1200px', margin: '0 auto',marginTop:'20px'}}>
        <div className={styles.logo}>
          <img src={imageUrl} alt="avatar" className={styles.image}/>
        </div>
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
