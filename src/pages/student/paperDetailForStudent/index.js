import React from 'react';
import {Divider, List} from 'antd';
import {connect} from 'dva';
import styles from '@/style/common.less';
import moment from 'moment';
import * as Util from '@/utils/util';

class PaperDetailForStudent extends React.Component {
  //渲染评价
  renderEvaluate(paperPlanDetailVO){
    return  (
      <div>
        <Divider style={{marginBottom:'5px'}}/>
        <div className="clearfix">
          <div className="pullleft" style={{fontSize:'20px',fontWeight:'700'}}>评价：</div>
          <div >{paperPlanDetailVO.evaluate}</div>
        </div>
      </div>
    )
  }
  renderExamType(exam,index){
    if (exam.examType == 1) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 单选题</div>
    if (exam.examType == 2) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 多选题</div>
    if (exam.examType == 3) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 判断题</div>
    if (exam.examType == 5) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 填空题</div>
    if (exam.examType == 4) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 问答题</div>
  }

  isCollect = (item) => {
    return (item.mark && item.studentExamResult && item.mark !== item.studentExamResult.score) ? styles.red :styles.black;
  }

  renderExamList(paperExamSummery) {
    let examTypeIndex = 0;
    const listItems = paperExamSummery.map( (paperExam,i) => {

      examTypeIndex ++;

      return <List key={paperExam.examType}
        style={{marginTop: '20px'}}
        header={
          this.renderExamType(paperExam,examTypeIndex)
        }
        bordered
        dataSource={paperExam.paperExamVOList}
        itemLayout="vertical"
        renderItem={(item, index) => (
          <List.Item key={item.examId}>
            <List.Item.Meta
              title={
                <div className={this.isCollect(item)}>
                  <div className={`pullleft`}>{index + 1}.</div>
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

            {(item.passPercent != null) &&(
              <div className="clearfix">
                <div className="pullleft">正确率：{item.passPercent}%</div>
              </div>
            )
            }

            {item.studentExamResult && (
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
      type: 'paperDetailForStudent/init',
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
          <div className="pullleft" style={{width:'85%',fontSize: '24px', lineHeight: '40px',textAlign: 'center',fontWeight:'700'}}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{fontSize: '12px', lineHeight: '20px',width:'15%'}}>
            <div>总分：{totalScore}</div>
            <div>开始时间：{paperPlanDetailVO.effDate?moment(paperPlanDetailVO.effDate).format('YYYY/MM/DD HH:MM:ss'):''}</div>
            <div>结束时间：{paperPlanDetailVO.expDate?moment(paperPlanDetailVO.expDate).format('YYYY/MM/DD HH:MM:ss'):''}</div>
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
  ...state.paperDetailForStudent,
  // loading: state.loading.models.paperDetailForStudent,
}))(PaperDetailForStudent);
