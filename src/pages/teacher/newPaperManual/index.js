import React from 'react';
import {connect} from 'dva';
import styles from '@/style/common.less';
import {Form, InputNumber, Icon, Spin, Button, Checkbox, Row, Col, List, Radio, Divider} from 'antd';
import ExamListModal from './components/examListModal'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import OlBraftEditor from '@/components/olBraftEditor/OlBraftEditor'
import * as Util from '@/utils/util'
import {cloneDeep} from 'lodash';

const mapExamName = {};
mapExamName[1] = "单选题";
mapExamName[2] = "多选题";
mapExamName[3] = "判断题";
mapExamName[4] = "问答题";
mapExamName[5] = "填空题";
let paperList = []
class newPaperManual extends React.Component {
  constructor() {
    super()
  }

  moveUp = (indexExam, indexExamType) => {

    //必须重新new一个对象，如果是旧的对象，只变化旧对象的内容是无法触发渲染。

    const {paperExamSummery, dispatch} = this.props;

    let newPaperExamSummery = [];
    paperExamSummery.map((item, k) => {
      newPaperExamSummery[k] = cloneDeep(item);
    })

    let {paperExamVOList} = newPaperExamSummery[indexExamType];

    let temp = paperExamVOList[indexExam - 1];
    paperExamVOList[indexExam - 1] = paperExamVOList[indexExam];
    paperExamVOList[indexExam] = temp;

    dispatch({
      type: 'newPaperManual/save',
      payload: {
        paperExamSummery: newPaperExamSummery
      },
    });

  }

  moveDown = (indexExam, indexExamType) => {
    const {paperExamSummery, dispatch} = this.props;

    let newPaperExamSummery = [];
    paperExamSummery.map((item, k) => {
      newPaperExamSummery[k] = cloneDeep(item);
    })

    let {paperExamVOList} = newPaperExamSummery[indexExamType];

    let temp = paperExamVOList[indexExam + 1];
    paperExamVOList[indexExam + 1] = paperExamVOList[indexExam];
    paperExamVOList[indexExam] = temp;

    dispatch({
      type: 'newPaperManual/save',
      payload: {
        paperExamSummery: newPaperExamSummery
      },
    });
  }

  removeExam = (record) => {
    const {paperExamSummery, dispatch} = this.props;
    //////////////////////////////
    if (paperExamSummery[record.examType] == null) {
      return;
    } else {
      paperExamSummery[record.examType].count = paperExamSummery[record.examType].count - 1;
      paperExamSummery[record.examType].totalScore = paperExamSummery[record.examType].totalScore - record.mark;

      let paperExamVOList = paperExamSummery[record.examType].paperExamVOList;

      for (let i in paperExamVOList) {
        if (paperExamVOList[i].examId == record.examId) {
          paperExamVOList.splice(i, 1);
          break;
        }
      }

      let newPaperExamSummery = [];
      paperExamSummery.map((item, k) => {
        if (item.paperExamVOList.length != 0) {
          newPaperExamSummery[k] = cloneDeep(item);
        }

      })

      dispatch({
        type: 'newPaperManual/save',
        payload: {
          paperExamSummery: newPaperExamSummery
        },
      });
    }
  }
  changeScore = (value, paperExam) => {
    paperExam.mark = value;
  }

  renderExamType(exam, index) {
    if (exam.examType == 1) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 单选题</div>
    if (exam.examType == 2) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 多选题</div>
    if (exam.examType == 3) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 判断题</div>
    if (exam.examType == 5) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 填空题</div>
    if (exam.examType == 4) return <div className={styles.examTypeLabel}>{Util.toChinesNum(index)}. 问答题</div>
  }

  renderExamList(paperExamSummery) {
    const {getFieldDecorator} = this.props.form;

    let examTypeNameIndex = 0;

    const listItems = paperExamSummery.map((paperExam, i) => {
      const {count} = paperExam;   //试题数量。

      examTypeNameIndex++;

      return <List key={paperExam.examType}
                   style={{marginTop: '20px'}}
                   header={
                     this.renderExamType(paperExam, examTypeNameIndex)
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

                             <div className="pullright">
                               <Button className="pullleft" disabled={index == 0 ? true : false} onClick={(e) => {
                                 this.moveUp(index, i)
                               }}>
                                 上移
                               </Button>
                               <Button className="pullleft" disabled={index == (count - 1) ? true : false}
                                       onClick={(e) => {
                                         this.moveDown(index, i)
                                       }}>
                                 下移
                               </Button>
                               <Button className="pullleft" onClick={(e) => {
                                 this.removeExam(item)
                               }}>
                                 移除
                               </Button>

                             </div>
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

                       {item.result && (
                         <div className="clearfix">
                           <div className="pullleft">正确答案：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.result}}/>
                         </div>
                       )
                       }

                       { item.examSolution && (
                         <div className="clearfix">
                           <div className="pullleft">讲解：</div>
                           <div className="pullleft" dangerouslySetInnerHTML={{__html: item.examSolution}}/>
                         </div>
                       )
                       }

                       <div className="clearfix">

                         <div className="pullleft">
                           <Form.Item label="分数">
                             {getFieldDecorator(`scores[${item.examId}].score`, {
                               initialValue: item.mark,
                               rules: [{required: true, message: '请输入分数'}],
                             })(<InputNumber width='20px' onChange={(value) => {
                               this.changeScore(value, item)
                             }}/>)}
                           </Form.Item>
                         </div>
                       </div>

                     </List.Item>
                   )}
      />
    })

    return listItems;
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {query} = this.props.location;
    if (query.paperId) {
      dispatch({
        type: 'newPaperManual/paperExamDetail',
        payload: {
          paperId: query.paperId,
        },
      });
    }
  }

  addForm = e => {
    const {dispatch} = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        examListVisible: true,
      },
    });
  }

  handleSubmit = e => {

    const {dispatch, history} = this.props;
    const {query} = this.props.location;

    const createStaffId = Util.getStaffId();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const {scores} = values;

        let paperExamItems = [];

        let sort = 0;
        for (let i in scores){
          paperExamItems.push({
            sort,
            examId:i,
            mark:scores[i].score,
          })
          sort ++;
        }

        let payload = {
          paperId: query.paperId,
          createStaffId: createStaffId,
          passScore: values.passScore,
          paperExamItems: paperExamItems
        }

        dispatch({
          type: 'newPaperManual/paperExamSave',
          payload: {
            ...payload
          },
        });

      }
    });
  };

  getTotalScore = () => {
    const {paperExamSummery} = this.props

    let totalScore = 0;

    for (let i in paperExamSummery) {
      for (let j in paperExamSummery[i].paperExamVOList) {
        if (paperExamSummery[i].paperExamVOList[j].mark) {
          totalScore += paperExamSummery[i].paperExamVOList[j].mark;
        }
      }
    }

    return totalScore;

  }

  render() {
    const {form, examListVisible, paperDetail, loading, paperExamSummery} = this.props;
    const {paperName}  = paperDetail;
    const {getFieldDecorator} = form;


    let totalScore = this.getTotalScore();

    return (
      <Spin spinning={loading}>
        <div className={styles.box}>
          <div className="clearfix">
            <div className="pullleft" style={{width: '10%'}}>
              <Button type="dashed" onClick={this.addForm} style={{width: '60%'}}>
                <Icon type="plus"/> 选择试题
              </Button>
            </div>

            <div className="pullleft"
                 style={{width: '80%', fontSize: '24px', lineHeight: '40px', textAlign: 'center', fontWeight: '700'}}>
              <span>{paperName}</span>
            </div>
            <div className="pullright" style={{fontSize: '16px', lineHeight: '20px', width: '10%', fontWeight: '700'}}>
              <div>总分：{totalScore || '-'}</div>
            </div>
          </div>
          <Divider />
          <Form>
            {this.renderExamList(paperExamSummery)}
            <Form.Item label="及格分数：">
              {getFieldDecorator('passScore', {
                initialValue:paperDetail.passScore,
                rules: [{required: true, message: '请输入及格分数'}],
              })(<InputNumber width='100px'/>)}
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={(e) => {
                this.handleSubmit(e)
              }}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
        <ExamListModal examListVisible={examListVisible} getStockInfo={(e) => {
          this.examListMakeUp(e, getFieldDecorator, '0')
        }}/>
      </Spin>
    )
  }
}

const NewPaperManualForm = Form.create({name: 'newPaperAutoForm'})(newPaperManual);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(NewPaperManualForm);
