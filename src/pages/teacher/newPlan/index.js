import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form, AutoComplete, TreeSelect, Input, DatePicker, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from '../../../style/common.less';
import ExmaListModal from './components/examListModal'
import * as Util from '@/utils/util';
const { TreeNode } = TreeSelect;
const { Option } = AutoComplete;


class NewPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
      type: 'newPlan/listPage',
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
      type: 'newPlan/listPage',
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
  componentWillMount() {
    const { dispatch,paperPlanListVOList} = this.props;
    const { query } = this.props.location
    dispatch({
      type: 'newPlan/init',
      payload: {
        planId:query.planId
      },
    });
  }

  selExam= e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'newPlan/save',
      payload: {
        examListVisible:true,
      },
    })

  }

  examListMakeUp = (value) => {

    console.log("examListMakeUp",value)
    const { dispatch,paperPlanListVOList} = this.props;

    let tempArr = []
    for(let i=0;i<value.length;i++){
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
    //   payload: {
    //     paperPlanListVOList: paperPlanListVOList.splice(index,1)
    //   },
    // });

    this.setState({
      paperPlanListVOList:paperPlanListVOList.splice(index,1)
    })

  }
  handleCancel = e =>{
    router.push('/teacher/paperPlan')
  }

  handleCommit = e =>{

    const { dispatch, form,paperPlanListVOList } = this.props;
    const { resetFields } = form;
    const {query} = this.props.location
    const getValues = this.props.form.getFieldsValue();

    for(let i=0;i<paperPlanListVOList.length;i++){
      getValues.paperPlanListSaves[i].paperId = paperPlanListVOList[i].paperId
      getValues.paperPlanListSaves[i].effDate = new Date(getValues.paperPlanListSaves[i].effDate.format('YYYY-MM-DD HH:mm:ss')).getTime()
    }
    getValues.createStaffId = Util.getStaffId()
    if(query.planId){
      getValues.planId = query.planId
    }

    console.log(getValues)
    dispatch({
      type: 'newPlan/savePaperPlan',
      payload: {
        ...getValues
      },
    });

  }

  render() {
    const { paperPlanListVOList, loading, form, treeDepartData,examListVisible,staffList,planDetail} = this.props;
    const { getFieldDecorator } = form;

    console.log(planDetail)

    let startValue = []
    for(let item of paperPlanListVOList){
      startValue.push(parseInt(item.effDate))
    }

    console.log("startValue",startValue)
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
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:SS') :'-'}</span>,
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
                {initialValue:''}
                )(
                <DatePicker defaultValue={moment(startValue[index], "YYYY-MM-DD HH:mm:ss")} showTime format="YYYY-MM-DD HH:mm:ss" />,
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

      <div className={styles.box}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <Form.Item label="计划名称:">
              {getFieldDecorator('planName', {
                initialValue:planDetail?planDetail.planName:'' ,
              })(
                <Input/>
              )}
            </Form.Item>


            <Form.Item label="发布部门">
              {getFieldDecorator('planDepartId', {
                initialValue:planDetail?planDetail.planDepartId:'' ,
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
            <span className={styles.chooseExam} onClick={this.selExam}>试卷选择</span>
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

            {
              <div>
              <Button style={{marginLeft: '10px'}} type="default"
                      onClick={e => this.handleCancel()}>取消</Button>
            <Button style={{marginLeft: '10px'}} type="primary"
                    onClick={e => this.handleCommit()}>提交</Button>
              </div>
            }
          </Col>
        </Row>

      </div>
    );
  }
}


const NewPlanForm = Form.create({ name: 'newPlanForm' })(
  NewPlan,
);

export default connect(state => ({
  ...state.newPlan,
  loading: state.loading.models.newPlan,
}))(NewPlanForm);
