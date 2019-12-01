import { Tabs, Row, Col ,Spin} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';


import styles from './index.less';
import OTree from './components/tree';
import OList from './components/list';

const { TabPane } = Tabs;

function CourseManage({loading}) {
  const onTabClick = (e)=>{
    if(e==="基础资料"){
      router.push('/teacher');
    }else if(e==="课程管理"){
      router.push('/teacher/courseManage');
    }
  }
  return (
    <div className={styles.box}>
      <Tabs defaultActiveKey="课程管理" onTabClick={onTabClick}>
        <TabPane tab='基础资料' key="基础资料"></TabPane>
        <TabPane tab='课程管理' key="课程管理">
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={6}>
              <OTree />
            </Col>
            <Col span={18}>
              <OList />
            </Col>
          </Row>
        </Spin>
        </TabPane>
      </Tabs>
    </div>
  );
}
export default connect((state)=>({loading:state.loading.models.courseManage}))(CourseManage);
