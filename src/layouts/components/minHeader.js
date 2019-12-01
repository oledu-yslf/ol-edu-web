import { Menu, Button,Avatar } from 'antd';
import styles from './minHeader.css';
import Link from 'umi/link';
import router from 'umi/router';

function OMinHeader(props) {
  const handleClick = e => {};
  const handleAvatarClick = e =>{
    console.log(roleInfo);
    if(roleInfo.staffType == 0 || roleInfo.staffType == 1){
      router.push('/teacher')
    }else{
      router.push('/student')
    }
    
  }
  const roleInfo = JSON.parse(localStorage.getItem('roleInfo'));
  return (
    <div className={styles.box}>
      <div className={styles.left}>
        <div className={styles.logo} />
        <Menu onClick={handleClick} mode="horizontal" className={styles.menu}>
          <Menu.Item key="index">
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="course">
            <Link to="/course">课程中心</Link>
          </Menu.Item>
          <Menu.Item key="question">
            <Link to="/teacher">试题中心</Link>
          </Menu.Item>
          <Menu.Item key="result">
            <Link to="/teacher">成绩中心</Link>
          </Menu.Item>
          <Menu.Item key="task">
            <Link to="/teacher">作业中心</Link>
          </Menu.Item>
        </Menu>
      </div>
    
      {roleInfo ? (
        <Button type="link" className={styles.right} onClick={handleAvatarClick}>
          <Avatar  icon="user" />
        </Button>
      ) : (
        <Button type="link" className={styles.right}>
          <Link to="/login">登录</Link>
        </Button>
      )}
      
    </div>
  );
}

export default OMinHeader;
