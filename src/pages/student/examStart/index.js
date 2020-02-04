import React from 'react';
import {Row, Col, List, Button} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import moment from 'moment';
import router from 'umi/router';


const data = [
  {type:'单选题',num:'2',score:'5'},
  {type:'多选题',num:'3',score:'7'},
  {type:'判断题',num:'4',score:'30'},
  {type:'填空题',num:'5',score:'10'},
  {type:'问答题',num:'6',score:'25'},
];
class ExamOrHomework extends React.Component {
  componentWillMount (){
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'examStart/init',
      payload:{
        ...query
      }
    });
  }
  startAnswering=()=>{
    router.push('/student/examStartDetail');
  }

render() {
  const {paperDetail} = this.props;
  const {paperName, totalScore, paperPlanDetailVO, mapPaperExamSummary} = paperDetail;

  return (
      <div className={styles.box}>
        <div className="clearfix">
          <div className="pullleft" style={{fontSize: '20px', lineHeight: '80px'}}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{fontSize: '20px', lineHeight: '80px'}}>
            <span style={{fontSize: '14px', lineHeight: '80px'}}>开始时间：{paperPlanDetailVO?moment(paperPlanDetailVO.effDate).format('YYYY/MM/DD HH:MM:SS'):''}</span>
            <span style={{fontSize: '14px', lineHeight: '80px'}}>结束时间：{paperPlanDetailVO?moment(paperPlanDetailVO.expDate).format('YYYY/MM/DD HH:MM:SS'):''}</span>
          </div>

        </div>
        <Row>
          <Col span={12} offset={6}>
            <div className="gutter-box" style={{textAlign:'center',fontSize: '20px'}}>满分：{totalScore}</div>
          </Col>
          <Col span={12} offset={6}>
            <div className="gutter-box" style={{fontSize: '20px'}}>共分为三个部分：</div>
          </Col>
          <Col span={12} offset={6}>
            <List
              dataSource={data}
              renderItem={item =>
                <List.Item>
                    <Col span={8}>{item.type}</Col>
                    <Col span={8} style={{textAlign:'center'}}>{item.num} 题</Col>
                    <Col span={8} style={{textAlign:'right'}}>{item.score} 分</Col>
                </List.Item>

              }
            >
            </List>

          </Col>
          <Col span={12} offset={6} style={{textAlign:'center',marginTop:'30px'}}>
            <Button type="primary" onClick={this.startAnswering}>开始答题</Button>
          </Col>
        </Row>



      </div>
    );
  }

}

export default connect(state =>(
  {
    ...state.examStart,
    // loading: state.loading.models.examOrHomework,
  }))(ExamOrHomework);

