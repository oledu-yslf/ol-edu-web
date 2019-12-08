import { Tabs, Row, Col, Descriptions } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import styles from './index.less';
import OTree from './components/tree';
// import { chapterDetail } from './services/courseDetail';

const { TabPane } = Tabs;

function CourseDetail(props) {
  const onTabClick = e => {
    if (e === '课程编辑') {
      router.push({
        pathname: '/teacher/courseEdit',
        query: {
          id: props.courseDetail.courseId,
        },
      });
    } else if (e === '课程详情') {
      router.push({
        pathname: '/teacher/courseDetail',
        query: {
          id: props.courseDetail.courseId,
        },
      });
    }
  };
  const { periodDetail, chapterDetail, courseDetail, isSelectedNode, isLeaf } = props;
  const Desc = () => {
    if (!isSelectedNode && courseDetail.courseName) {
      return (
        <Descriptions layout="horizontal" column={1}>
          <Descriptions.Item label="课程名称">{courseDetail.courseName}</Descriptions.Item>
          <Descriptions.Item label="课程介绍">{courseDetail.introduce}</Descriptions.Item>
          <Descriptions.Item label="课程logo">
            <a href={`${courseDetail.logoFile.url}${courseDetail.logoFile.fileName}`}>
              {courseDetail.logoFile.fileName}
            </a>
          </Descriptions.Item>
        </Descriptions>
      );
    } else if (isSelectedNode && !isLeaf && chapterDetail.chapterName) {
      return (
        <Descriptions layout="horizontal" column={1}>
          <Descriptions.Item label="章节名称">:{chapterDetail.chapterName}</Descriptions.Item>
          <Descriptions.Item label="课时数">:{chapterDetail.totalPeriod}</Descriptions.Item>
          <Descriptions.Item label="总时长">:{'-'}</Descriptions.Item>
        </Descriptions>
      );
    } else if (isSelectedNode && isLeaf && periodDetail.periodName) {
      return (
        <Descriptions layout="horizontal" column={1}>
          <Descriptions.Item label="课时名称">:{periodDetail.periodName}</Descriptions.Item>
          <Descriptions.Item label="时长">:{'-'}</Descriptions.Item>
          <Descriptions.Item label="视频">:
            {periodDetail.videoFileInfo ? (
                <span>{periodDetail.videoFileInfo.fileName}</span>
            ) : (
              <span>无</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="附件">:{periodDetail.attachFileInfo?periodDetail.attachFileInfo.fileName:'无'}</Descriptions.Item>
        </Descriptions>
      );
    } else {
      return '';
    }
  };

  return (
    <div className={styles.box}>
      <Tabs defaultActiveKey="课程详情" onTabClick={onTabClick}>
        <TabPane tab="课程编辑" key="课程编辑"></TabPane>
        <TabPane tab="课程详情" key="课程详情">
          <Row gutter={24}>
            <Col span={6}>
              <OTree />
            </Col>
            <Col span={18}>
              <Desc />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}
export default connect(state => ({
  ...state.courseDetail,
  loading: state.loading.models.courseDetail,
}))(CourseDetail);
