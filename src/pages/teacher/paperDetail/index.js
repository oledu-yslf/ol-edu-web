import React from 'react';
import {Divider, List} from 'antd';
import {connect} from 'dva';
import styles from '@/style/common.less';
import * as Util from '@/utils/util';

class PaperDetail extends React.Component {

  renderExamType(exam,index){
    if (exam.examType == 1) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 单选题</div>
    if (exam.examType == 2) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 多选题</div>
    if (exam.examType == 3) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 判断题</div>
    if (exam.examType == 5) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 填空题</div>
    if (exam.examType == 4) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 问答题</div>
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
                           <div >
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

                       {item.result &&(
                         <div className="clearfix" >
                           <div className="pullleft">正确答案：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.result}}/>
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
      type: 'paperDetail/init',
      payload:{
        ...query
      }
    });
  }

  render() {
    const {paperDetail,staffInfo} = this.props;
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
          <div className="pullleft" style={{width:'95%',fontSize: '24px', lineHeight: '40px',textAlign: 'center',fontWeight:'700'}}>
            <span>{paperName}</span>
          </div>
          <div className="pullright" style={{fontSize: '16px', lineHeight: '20px',width:'5%',fontWeight:'700'}}>
            <div>总分：{totalScore ||'-'}</div>
          </div>
        </div>
        <Divider />

        {this.renderExamList(paperExamSummery)}
      </div>
    );
  }
}
export default connect(state => ({
  ...state.paperDetail,
   loading: state.loading.models.paperDetail,
}))(PaperDetail);
