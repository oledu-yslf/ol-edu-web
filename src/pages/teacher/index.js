import { Tabs } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const { TabPane } = Tabs;

function Teacher(e) {
  const onTabClick = (e)=>{
    if(e==="基础资料"){
      router.push('/teacher');
    }else if(e==="课程管理"){
      router.push('/teacher/courseManage');
    }
  }
  return (
    <div className={styles.box}>
      <Tabs defaultActiveKey="基础资料" onTabClick={onTabClick}>
        <TabPane tab='基础资料' key="基础资料"></TabPane>
        <TabPane tab='课程管理' key="课程管理"></TabPane>
      </Tabs>
    </div>
  );
}
export default Teacher;
