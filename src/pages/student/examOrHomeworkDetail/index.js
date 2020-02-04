import React from 'react';
import {Button, Col, List, Checkbox,Radio,Row} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import router from 'umi/router';
import BraftEditor from 'braft-editor'

//Todo 题目数组获取后，给数组设置一个显示不显示参数showCase
const data = [
    {"examName": "<span>在恒温恒容的密闭体系中，可逆反应：<img style={{ width: '100%', height: '160px' }}  alt=\"logo\" src={`/api/fileserver//examImage/20191215/1d90cc9564ca4e2ea1d4de2b880e8a1e/image1.png`}/>不能作为该反应达到化学平衡的标志的是()<p/><p>①v正(B)＝v逆(C)　②n(B)∶n(C)＝1∶1　③容器内压强不再改变　④容器内气体的密度不再改变　⑤容器内混合气体的平均相对分子质量不再改变<span/>",
      "examType": 1,
      "difficultyLevel": 1,
      "sort": 0,
      "mark": 4,
      "createStaffId": "2",
      "createDate": 1576847914000,
      "modifyDate": null,
      "modifyStaffId": null,
      "examSolution": null,
      "result": "<p>我是讲解<p/>",
      "paperExamAttrVOS": [
        {
          "paperExamAttrId": "f90e941757f34d9ca50f1ada56828675",
          "paperId": "0e10a9d4d4e5477eafcc0a868cd332c5",
          "paperExamId": "a051f619c65a4c43adc6fc2eb15f1890",
          "examId": "f8f34a48ea24458bac5862e063a97642",
          "examAttrId": "c19a82988a7943faa39cef8b9b2ef79a",
          "sort": "A",
          "attrName": "<span>②③④⑤<img style={{ width: '100%', height: '160px' }}  alt=\"logo\" src={`/api/fileserver//examImage/20191215/0aee5df9a8644d2f9edbaa4c37bc4e09/image2.png`}/><span/>",
          "createStaffId": "2",
          "createDate": 1576847914000,
          "modifyDate": null,
          "modifyStaffId": null
        },
        {
          "paperExamAttrId": "992d0df498c840b6abfae6207832c86d",
          "paperId": "0e10a9d4d4e5477eafcc0a868cd332c5",
          "paperExamId": "a051f619c65a4c43adc6fc2eb15f1890",
          "examId": "f8f34a48ea24458bac5862e063a97642",
          "examAttrId": "5ae096d5081f46b686dbc6f11da52f9c",
          "sort": "B",
          "attrName": "<span>②③<span/>",
          "createStaffId": "2",
          "createDate": 1576847914000,
          "modifyDate": null,
          "modifyStaffId": null
        }
        ]
    },
];

function Render ({ if: cond, children }) {
  return cond ? children : null
}

class ExamOrHomeworkDetail extends React.Component {
componentWillMount (){
    const {dispatch} = this.props;
    const {query} = this.props.location;
    dispatch({
      type: 'examOrHomework/init',
      payload:{
        ...query
      }
    });
  }

  handleNext = (values,index) =>{
    console.log(values)
    console.log(index)
    //Todo 提交题目
    data[index+1].showCase = false
    data[index].showCase = true

  }
  handlePre = (values,index) =>{
    console.log(values)
    console.log(index)
    //Todo
    data[index-1].showCase = true
    data[index].showCase = false
  }

render() {
  return (
      <div className={styles.box}>

        <List
          dataSource={data}
          renderItem={(item,index) =>
            //Todo <Render if={item.showCase}>判断到底哪道题显示
            <div  >
            <List.Item >
              <Row gutter={24}>
              <Col span={24}>
                <div dangerouslySetInnerHTML={{__html: item.examName}}></div>
                <Render if={item.examType=='1'} >
                  <Radio.Group style={{width:'100%'}}>
                      <List
                        style={{width:'100%'}}
                        dataSource={item.paperExamAttrVOS}
                        renderItem={(temp) =>
                          <List.Item style={{width:'100%'}}>
                            <Radio value={temp.sort} style={{width:'100%'}}>{temp.sort}、<span dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Radio>
                          </List.Item>
                        }>
                      </List>
                  </Radio.Group>
                </Render>
                <Render if={item.examType=='2'} >
                  <Checkbox.Group style={{width:'100%'}}  >
                    <List
                    style={{width:'100%'}}
                    dataSource={item.paperExamAttrVOS}
                    renderItem={(temp) =>
                      <List.Item style={{width:'100%'}}>
                        <Checkbox value={temp.sort} style={{width:'100%'}}>{temp.sort}、<span dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Checkbox>
                      </List.Item>
                    }>
                    </List>
                  </Checkbox.Group>
                </Render>
                <Render if={item.examType=='3'} >
                  <Radio.Group style={{width:'100%'}} >
                    <List
                      style={{width:'100%'}}
                      dataSource={item.paperExamAttrVOS}
                      renderItem={(temp) =>
                        <List.Item style={{width:'100%'}}>
                          <Checkbox value={temp.sort} style={{width:'100%'}}>{temp.sort}、<span dangerouslySetInnerHTML={{__html: temp.attrName}}></span></Checkbox>
                        </List.Item>
                      }>
                    </List>
                  </Radio.Group>
                </Render>

                <Render if={item.examType=='4'} >
                    <List
                      style={{width:'100%'}}
                      dataSource={item.paperExamAttrVOS}
                      renderItem={(temp) =>
                        <List.Item style={{width:'100%'}}>
                         <span dangerouslySetInnerHTML={{__html: temp.attrName}}></span><input/>
                        </List.Item>
                      }>
                    </List>
                </Render>

                <Render if={item.examType=='5'} >
                  <List
                    style={{width:'100%'}}
                    dataSource={item.paperExamAttrVOS}
                    renderItem={(temp) =>
                      <List.Item style={{width:'100%'}}>
                        <span dangerouslySetInnerHTML={{__html: temp.attrName}}></span>
                        <BraftEditor
                          contentStyle={{height:80,overflow:'scroll'}}
                          // value={editor}
                          onChange={this.handleEditorChange}
                        />
                      </List.Item>
                    }>
                  </List>
                </Render>
              </Col>
              </Row>


            </List.Item>
              <Row >
                <Col style={{textAlign:'center',marginTop:'30px'}}>
                <Button disabled={index==0} style={{marginRight:'10px'}} onClick={e => this.handlePre(item,index)}>上一题</Button>
                <Button style={{marginLeft:'10px'}} type="primary" onClick={e => this.handleNext(item,index)}>下一题</Button>
                </Col>
              </Row>
            </div>


          }
        >
        </List>


      </div>
    );
  }


}

export default connect(state =>(
  {
    ...state.examStartDetail,
    //loading: state.loading.models.examOrHomeworkDetail,
  }))(ExamOrHomeworkDetail);

