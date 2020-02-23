import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form, AutoComplete, TreeSelect, Input, DatePicker, Row, Col, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../../../style/common.less';
import ExmaListModal from './examListModal'
import * as Util from '@/utils/util';
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;


class NewPlan extends React.Component {
  constructor(props) {
    super(props);
  }
  onTabClick = e => {
    router.push(e);
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form,pageSize } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;
    dispatch({
      type: 'paperPlan/listPage',
      payload: {
        paperId,
        planId,
        departId,
        page: {
          pageNum: 1,
          pageSize,
        },

      },
    });
  };


  handleChange = (pager,filters,sorter) => {

    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperId, planId, departId } = value;

    let orderBy = "";

    if (sorter.order){
      if (sorter.order === 'ascend'){
        orderBy = `${sorter.column.sortField} asc`;
      } else if (sorter.order === 'descend'){
        orderBy = `${sorter.column.sortField} desc`;
      }
    }

    dispatch({
      type: 'paperPlan/listPage',
      payload: {
        paperId,
        planId,
        departId,
        orderBy,
        page: {
          pageNum: pager.current,
          pageSize:pager.pageSize
        },
      },
    });
  };
  // componentWillMount() {
  //   const { dispatch, planId } = this.props;
  //   // const { query } = this.props.location
  //     dispatch({
  //       type: 'paperPlan/modalInit',
  //       payload: {
  //         planId:planId
  //       },
  //     });
  //
  // }

  selExam= e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'paperPlan/save',
      payload: {
        examListVisible:true,
      },
    })

  }

  examListMakeUp = (value) => {
    // console.log("examListMakeUp",value)
    const { dispatch,paperPlanListVOList} = this.props;


    let tempArr = []
    // paperPlanListVOList=[]
    if(paperPlanListVOList.length>0){
      for(let i=0;i<paperPlanListVOList.length;i++){
        tempArr.push(paperPlanListVOList[i].paperId)
      }
    }


    for(let i=0;i<value.length;i++){
        if(!tempArr.includes(value[i].paperId)){
          let temp = {}
          temp.paperVO = {}
          temp.paperVO.paperName = value[i].paperName
          temp.paperVO.paperType = value[i].paperType
          temp.paperVO.totalScore = value[i].totalScore
          temp.paperVO.createStaffName = value[i].createStaffName
          temp.createDate = value[i].createDate
          temp.paperId = value[i].paperId
          paperPlanListVOList.push(temp)
        }
    }
    dispatch({
      type: 'save',
      payload: {
        paperPlanListVOList:paperPlanListVOList
      },
    });

  }

  deletePlan = (record, index) =>{
    const {dispatch, paperPlanListVOList } = this.props;
    // dispatch({
    //   type: 'save',
    //   payload: {paperPlan
    //     paperPlanListVOList: paperPlanListVOList.splice(index,1)
    //   },
    // });

    this.setState({
      paperPlanListVOList:paperPlanListVOList.splice(index,1)
    })

  }
  handleCancel = e =>{
    // router.push('/teacher/paperPlan')
    const { dispatch } = this.props;
    dispatch({
      type: 'paperPlan/save',
      payload: {
        newPlanVisible: false,
      },
    });
  }

  handleCommit = e =>{

    const { dispatch, form,paperPlanListVOList,planId } = this.props;
    const { resetFields } = form;
    // const {query} = this.props.location
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const getValues = this.props.form.getFieldsValue();

        for (let i = 0; i < paperPlanListVOList.length; i++) {
          getValues.paperPlanListSaves[i].paperId = paperPlanListVOList[i].paperId
          getValues.paperPlanListSaves[i].effDate = new Date(getValues.paperPlanListSaves[i].effDate.format('YYYY-MM-DD HH:MM:ss')).getTime()
        }
        getValues.createStaffId = Util.getStaffId()
        if (planId) {
          getValues.planId = planId
        }

        console.log(getValues)
        dispatch({
          type: 'paperPlan/savePaperPlan',
          payload: {
            ...getValues
          },
        });
      }
    })

  }

  render() {
    const { paperPlanListVOList, loading, form, treeDepartData,examListVisible,staffList,planDetail,newPlanVisible} = this.props;
    const { getFieldDecorator } = form;

    let startValue = []
    for(let item of paperPlanListVOList){
      startValue.push(parseInt(item.effDate))
    }

    const planNode = staffList?staffList.map(item => <Option key={item.staffId}>{item.staffName}</Option>):'';
    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'paperVO.paperName',
      },
      {
        title: '试卷类型',
        dataIndex: 'paperVO.paperType',
        render: (text,record) => {
          return <span>{text == 0 ? '作业' : '试卷'}</span>
        }
      },

      {
        title: '创建时间',
        dataIndex: 'createDate',
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:ss') :'-'}</span>,
      },
      {
        title: '分数',
        dataIndex: 'paperVO.totalScore',
      },
      {
        title: '创建人员',
        dataIndex: 'paperVO.createStaffName',
        sortField:'paperVO.createStaffName',
      },
      {
        title: '时长',
        dataIndex: 'duration',
        render:(text,record,index)=>
          <span>
            <Form.Item label="">
              {getFieldDecorator(`paperPlanListSaves[${index}].duration`, {
                initialValue: record.duration,
              })(
                <Input/>
              )}
            </Form.Item>
          </span>
      },
      {
        title: '开始时间',
        dataIndex: 'effDate',
        render:(text,record,index)=>
          <span>
            <Form.Item label="">
              {getFieldDecorator(`paperPlanListSaves[${index}].effDate`,
                {initialValue:startValue[index]?moment(startValue[index]):''}
              )(
                <DatePicker defaultValue={moment(startValue[index], "YYYY-MM-DD HH:MM:ss")} showTime format="YYYY-MM-DD HH:MM:ss" />,
              )}
            </Form.Item>
          </span>
      },
      {
        title: '批卷老师',
        dataIndex: 'reviewStaffName',
        render:(text,record,index)=>
          <span>
            <Form.Item label="">
              {getFieldDecorator(`paperPlanListSaves[${index}].reviewStaffId`, {
                initialValue: record.reviewStaffId,
              })(
                <AutoComplete
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {planNode}
                </AutoComplete>,
              )}
            </Form.Item>
          </span>
      },
      {
        title: '操作',
        dataIndex: 'action',
        width:110,
        render: (text, record, index) => (
          <span>
            <a  onClick={e => this.deletePlan(record, index)}>
              移除
            </a>
          </span>
        ),
      },
    ];

    const renderDepartTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childDepartVOList) {
            return (
              <TreeNode
                value={item.departId}
                title={item.departName}
                key={item.departId}
                dataRef={item}
              >
                {renderDepartTreeNodes(item.childDepartVOList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.departId}
              title={item.departName}
              key={item.departId}
              dataRef={item}
            />
          );
        });
      }
    };


    return (
      <Modal
        title="新增/编辑计划"
        width='90%'
        visible={newPlanVisible}
        onCancel={this.handleCancel}
        onOk={this.handleCommit}
        confirmLoading={loading}
        destroyOnClose
      >
        <div className={styles.box}>
          <Spin spinning={loading}>
            <Form layout="inline">
              <div>
              <Form.Item label="计划名称:">
                {getFieldDecorator('planName', {
                  initialValue:planDetail?planDetail.planName:'' ,
                  rules: [{ required: true, message: '请输入计划名称!' }],

                })(
                  <Input/>
                )}
              </Form.Item>
              </div>
              <div>
              <Form.Item label="发布部门">
                {getFieldDecorator('planDepartId', {
                  initialValue:planDetail?planDetail.planDepartId:'' ,
                  rules: [{ required: true, message: '请选择发布部门!' }],
                })(
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '200px' }}
                    allowClear
                    onChange={this.treeChange}
                  >
                    {renderDepartTreeNodes(treeDepartData)}
                  </TreeSelect>,
                )}
              </Form.Item>
              </div>
              <div>
              <span className={styles.chooseExam} onClick={this.selExam}>试卷选择</span>
              </div>
              {/*<Form.Item>*/}
              {/*<Button*/}
              {/*type="primary"*/}
              {/*htmlType="submit"*/}
              {/*icon="search"*/}
              {/*onClick={this.handleSearchSubmit}*/}
              {/*>*/}
              {/*查询*/}
              {/*</Button>*/}
              {/*</Form.Item>*/}
              <Table
                rowKey={record => `${record.paperId}`}
                columns={columns}
                dataSource={paperPlanListVOList}
                pagination={false}
              />
            </Form>


          </Spin>

          <ExmaListModal examListVisible={examListVisible} getStockInfo={(e) => {this.examListMakeUp(e)}}></ExmaListModal>


          <Row style={{width:'100%'}}>
            <Col style={{textAlign: 'center', marginTop: '30px'}}>

              {/*{*/}
                {/*<div>*/}
                  {/*<Button style={{marginLeft: '10px'}} type="default"*/}
                          {/*onClick={e => this.handleCancel()}>取消</Button>*/}
                  {/*<Button style={{marginLeft: '10px'}} type="primary"*/}
                          {/*onClick={e => this.handleCommit()}>提交</Button>*/}
                {/*</div>*/}
              {/*}*/}
            </Col>
          </Row>

        </div>
      </Modal>
    );
  }
}


const NewPlanForm = Form.create({ name: 'newPlanForm' })(
  NewPlan,
);

export default connect(state => ({
  ...state.paperPlan,
  loading: state.loading.models.paperPlan,
}))(NewPlanForm);
