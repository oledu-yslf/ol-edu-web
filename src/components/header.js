import React from 'react';
import { Menu, Button, Avatar } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import avtor from '@/assets/avtor.jpeg';
import styles from './header.css';
import Link from 'umi/link';

const { SubMenu } = Menu;

class OHeader extends React.Component {
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

  renderMenu = (menusList) => {
    if (menusList){
      return menusList.map( (item)  => {
        if (item.childMenuVOList){
          return <SubMenu key={item.menuId}
                          title={
                            <span>{item.menuName}</span>
                          }
          >{this.renderMenu(item.childMenuVOList)}</SubMenu>
        }else {
          return <Menu.Item key={item.menuUrl}>{item.menuName}</Menu.Item>
        }
      }
      )
    }

    return null;
  }

  render() {
    const { roleInfo } = this.state;
    const { selectedMenu,logoFileInfo } = this.props;

    let menusList = roleInfo.showMenuList;

    let imageUrl = '';
    if (logoFileInfo) {
      imageUrl = `api${logoFileInfo.url}\/${logoFileInfo.fileName}`;
    }


    return (
      <div className={[styles.box, 'clearfix'].join(' ')}>
        <div className={styles.logo}>
          <img src={imageUrl} alt="avatar" style={{width: '96px', height: '48px'}}/>
        </div>
        <Menu
          onClick={this.handleClick}
          mode="horizontal"
          className={styles.menu}
          selectedKeys={selectedMenu}
        >
          <Menu.Item key="/">首页</Menu.Item>
          <Menu.Item key="/course">课程中心</Menu.Item>
          {this.renderMenu(menusList)}
        </Menu>
        {roleInfo ? (
          <div className={styles.pullright}>
            <span style={{ marginRight: '10px' }}>Hi,{roleInfo.staffName}</span>
            <a  onClick={this.handleLogoutClick}>退出</a>
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


export default connect(state => ({ ...state.global }))(OHeader);
