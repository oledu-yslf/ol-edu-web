import React from 'react';
import {Row, Col, List, Button} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import moment from 'moment';
import router from 'umi/router';


const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";


class examStart extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'examStart/init',
      payload: {
        ...query
      }
    });
  }

  startAnswering = (record) => {
    router.push(`/student/examStartDetail?paperId=${record.paperId}&staffId=${record.staffId}&planDetailId=${record.planDetailId}`);
  }

  render() {
    const {paperDetail, urlParam} = this.props;
    const {paperName, totalScore, paperPlanDetailVO, mapPaperExamSummary} = paperDetail;

    let paperExamSummery = [];

    let count = 0;
    for (var key in mapPaperExamSummary) {
      //查看效果
      paperExamSummery[count] = mapPaperExamSummary[key];
      count++;
    }

    console.log(urlParam);

    return (
      <div className={styles.box}>
        <div className="clearfix">
          <div className="" style={{fontSize: '24px', lineHeight: '48px', textAlign: 'center'}}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{fontSize: '20px', lineHeight: '28px'}}>
            <div style={{fontSize: '14px', lineHeight: '28px'}}>
              开始时间：{paperPlanDetailVO ? moment(paperPlanDetailVO.effDate).format('YYYY/MM/DD HH:MM:SS') : ''}</div>
            <div style={{fontSize: '14px', lineHeight: '28px'}}>
              结束时间：{paperPlanDetailVO ? moment(paperPlanDetailVO.expDate).format('YYYY/MM/DD HH:MM:SS') : ''}</div>
          </div>

        </div>
        <Row>
          <Col span={12} offset={6}>
            <div className="gutter-box" style={{textAlign: 'center', fontSize: '20px'}}>满分：{totalScore}</div>
          </Col>
          <Col span={12} offset={6}>
            <div className="gutter-box" style={{fontSize: '20px'}}>共分为{count}个部分：</div>
          </Col>
          <Col span={12} offset={6}>
            <List
              dataSource={paperExamSummery}
              renderItem={(item) => (
                <List.Item >
                  <Col span={8}>{mapExamName[item.examType]}</Col>
                  <Col span={8} style={{textAlign: 'center'}}>{item.count} 题</Col>
                  <Col span={8} style={{textAlign: 'right'}}>{item.totalScore} 分</Col>
                </List.Item>
              )}
            >
            </List>

          </Col>
          <Col span={12} offset={6} style={{textAlign: 'center', marginTop: '30px'}}>
            <Button type="primary" onClick={e => this.startAnswering(urlParam, e)}>开始答题</Button>
          </Col>
        </Row>

      </div>
    );
  }

}

export default connect(state => (
  {
    ...state.examStart,
    // loading: state.loading.models.examOrHomework,
  }))(examStart);

