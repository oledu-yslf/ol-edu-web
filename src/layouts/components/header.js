import { Menu, Button } from 'antd';
import styles from './header.css';
import Link from 'umi/link';
function OHeader(props) {
  const handleClick = e => {};
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
    
      <Button type="link" className={styles.right}>
        <Link to="/login">登录</Link>
      </Button>
      
    </div>
  );
}

export default OHeader;
