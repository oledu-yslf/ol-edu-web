import { Button } from 'antd';
import styles from './loginHeader.css';
import Link  from 'umi/link';
function OLoginHeader(props) {
  return (
    <div className={styles.box}>
      <div className={styles.left} />
      <Button type="link" className={styles.right}>
        <Link to="/">返回首页</Link>
      </Button>
    </div>
  );
}

export default OLoginHeader;
