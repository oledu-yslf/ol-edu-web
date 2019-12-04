import { Menu, Button, Avatar, Row, Col } from 'antd';
import styles from './minHeader.css';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import avtor from '@/assets/avtor.jpeg';

function OMinHeader(props) {
  const { dispatch, selectedMenu } = props;
  const handleClick = e => {
    dispatch({
      type: 'global/save',
      payload: {
        selectedMenu: e.keyPath,
      },
    });
  };
  const handleAvatarClick = e => {
    if (roleInfo.staffType === '0' || roleInfo.staffType === '1') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  };
  const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
  return (
    <Row className={styles.box}>
      <Col span={3}>
        <div className={styles.logo} />
      </Col>
      <Col span={18}>
        <Menu
          onClick={handleClick}
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
      </Col>
      <Col span={3}>
        {roleInfo ? (
          <div>
            <span style={{ marginRight: '10px' }}>Hi,{roleInfo.staffName}</span>
            <Button type="link" className={styles.right} onClick={handleAvatarClick}>
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

export default connect(state => ({ ...state.global }))(OMinHeader);
