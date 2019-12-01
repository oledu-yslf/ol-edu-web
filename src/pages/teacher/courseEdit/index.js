import { connect } from 'dva';
import { Tabs } from 'antd';
import router from 'umi/router';

import PlusCourse from './components/plusCourse'

import styles from './index.less';

const { TabPane } = Tabs;
function CourseEdit(props) {

  const onTabClick = (e) => {
    if (e === "课程编辑") {
      router.push({
        pathname:'/teacher/courseEdit',
        query:{
          id:props.courseId
        }
      });
    } else if (e === "课程详情") {
      router.push({
        pathname:'/teacher/courseDetail',
        query:{
          id:props.courseId
        }
      });
    }
  }
  let disabled = false;
  if(!props.categoryId){
    disabled = true;
  }

  return (
    <div className={styles.box}>
      <Tabs defaultActiveKey="课程编辑" onTabClick={onTabClick}>
        <TabPane tab='课程编辑' key="课程编辑">
          <PlusCourse/>
        </TabPane>
        
        <TabPane tab='课程详情' key="课程详情" disabled={disabled}></TabPane>
      </Tabs>
    </div>
  );
}
export default connect((state) => ({ ...state.courseEdit,loading:state.loading.models.courseEdit }))(CourseEdit);
