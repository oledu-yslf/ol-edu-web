import React from 'react';
import {Divider, List} from 'antd';
import {connect} from 'dva';
import styles from '../../../style/common.less';
import moment from 'moment';

class StudentAchieveDetail extends React.Component {
  //渲染评价
  renderEvaluate(paperPlanDetailVO){
    return (paperPlanDetailVO && paperPlanDetailVO.evaluate && (
      <div>
        <div className="clearfix">
          <div className="pullleft">评价：</div>
        </div>
        <Divider />
        <div className="clearfix">
          <div className="pullleft">{paperPlanDetailVO.evaluate}</div>
        </div>
      </div>
    ))
  }
  renderExamType(exam){
    if (exam.examType == 1) return <div>单选题</div>
    if (exam.examType == 2) return <div>多选题</div>
    if (exam.examType == 3) return <div>判断题</div>
    if (exam.examType == 5) return <div>填空题</div>
    if (exam.examType == 4) return <div>问答题</div>
  }
  renderExamList(paperExamSummery) {
    const listItems = paperExamSummery.map( (paperExam) => {

      return <List key={paperExam.examType}
                   style={{marginTop: '20px'}}
                   header={
                     this.renderExamType(paperExam)
                   }
                   bordered
                   dataSource={paperExam.paperExamVOList}
                   itemLayout="vertical"
                   renderItem={(item, index) => (
                     <List.Item key={item.examId}>
                       <List.Item.Meta
                         title={
                           <div className="clearfix">
                             <div className="pullleft">{index + 1}.</div>
                             <div
                               className="pullleft"
                               dangerouslySetInnerHTML={{__html: item.examName}}
                             />
                             <div className="pullright">分数: {item.mark}</div>
                           </div>
                         }
                       />
                       {item.paperExamAttrVOS.map(v => {
                         return (
                           <div className="clearfix" key={v.examAttrId}>
                             <div className="pullleft">{v.sort}.</div>
                             <div className="pullleft" dangerouslySetInnerHTML={{__html: v.attrName}}/>
                           </div>
                         );
                       })}
                       <Divider />
                       {item.studentExamResult && item.studentExamResult.result && (
                         <div className="clearfix">
                           <div className="pullleft">您的答案：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.studentExamResult.result}}/>
                         </div>
                       )
                       }

                       {item.result &&(
                         <div className="clearfix" >
                           <div className="pullleft">正确答案：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.result}}/>
                         </div>
                       )
                       }

                       {item.passPercent &&(
                         <div className="clearfix">
                           <div className="pullleft">正确率：{item.passPercent}</div>
                         </div>
                       )
                       }

                       {item.studentExamResult && item.studentExamResult.score && (
                         <div className="clearfix">
                           <div className="pullleft">得分：{item.studentExamResult.score}</div>
                         </div>
                       )
                       }
                       { item.examSolution && (
                         <div className="clearfix" >
                           <div className="pullleft">讲解：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.examSolution}}/>
                         </div>
                       )
                       }

                     </List.Item>
                   )}
      />
    })

    return listItems;
  }

  componentWillMount (){
    const {dispatch} = this.props;
    const {query} = this.props.location;

    dispatch({
      type: 'studentAchieveDetail/init',
      payload:{
        ...query
      }
    });
  }

  render() {
    const {paperDetail} = this.props;
    const {paperName, totalScore, paperPlanDetailVO, mapPaperExamSummary} = paperDetail;

    let exam = [];
    let paperExamSummery = [];
    for (let i in mapPaperExamSummary) {
      exam[i] = mapPaperExamSummary[i].paperExamVOList;
      paperExamSummery[i] = mapPaperExamSummary[i];
    }

    console.log(paperExamSummery);

    if (paperPlanDetailVO === undefined) {
      return <div></div>;
    }

    return (
      <div className={styles.box}>
        <div className="clearfix">
          <div className="pullleft" style={{fontSize: '24px', lineHeight: '40px',textAlign: 'center'}}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{fontSize: '12px', lineHeight: '20px'}}>
            <div>总分：{totalScore}</div>
            <div>开始时间：{paperPlanDetailVO.effDate?moment(paperPlanDetailVO.effDate).format('YYYY/MM/DD HH:MM:SS'):''}</div>
            <div>结束时间：{paperPlanDetailVO.expDate?moment(paperPlanDetailVO.expDate).format('YYYY/MM/DD HH:MM:SS'):''}</div>
            <div>得分：{paperPlanDetailVO.score ? paperPlanDetailVO.score : '-'}</div>
          </div>
        </div>
        <Divider />

        {this.renderExamList(paperExamSummery)}
        {this.renderEvaluate(paperPlanDetailVO)}
      </div>
    );
  }
}
export default connect(state => ({
  ...state.studentAchieveDetail,
  // loading: state.loading.models.studentAchieveDetail,
}))(StudentAchieveDetail);
