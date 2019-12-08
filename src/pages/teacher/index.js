import React from 'react';
import { Tabs } from 'antd';
import router from 'umi/router';
import styles from './index.less';

const { TabPane } = Tabs;

class Teacher extends React.Component{
  onTabClick = (e)=>{
    if(e==="基础资料"){
      router.push('/teacher');
    }else if(e==="课程管理"){
      router.push('/teacher/courseManage');
    }
  }
  render(){
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="基础资料" onTabClick={this.onTabClick}>
          <TabPane tab='基础资料' key="基础资料"></TabPane>
          <TabPane tab='课程管理' key="课程管理"></TabPane>
        </Tabs>
      </div>
    )
  }
  
}
export default Teacher;
