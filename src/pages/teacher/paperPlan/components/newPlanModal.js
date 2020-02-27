import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Button, Table, Spin, Form, AutoComplete, TreeSelect, Input, DatePicker, Row, Col, Modal ,message} from 'antd';
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


  selExam= e =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'paperPlan/save',
      payload: {
        examListVisible:true,
      },
    })

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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const getValues = this.props.form.getFieldsValue();

        for (let i = 0; i < paperPlanListVOList.length; i++) {
          getValues.paperPlanListSaves[i].paperId = paperPlanListVOList[i].paperId
          getValues.paperPlanListSaves[i].effDate = new Date(getValues.paperPlanListSaves[i].effDate.format('YYYY-MM-DD HH:mm:ss')).getTime()
        }

        if (!getValues.paperPlanListSaves){
          message.error("请选择需要发布的试卷!")
          return ;
        }



        let type = '';
        if (planId) {
          //更新
          type = 'paperPlan/paperPlanUpdate'

          getValues.planId = planId;
          getValues.modifyStaffId = Util.getStaffId();
        } else {
          //新增
          type = 'paperPlan/savePaperPlan'
          getValues.createStaffId = Util.getStaffId();
        }

        console.log(getValues);

        dispatch({
          type:type,
          payload: {
            ...getValues
          },
        }).then (res => {
          const {  form,pageSize } = this.props;
          const value = form.getFieldsValue();
          const { planName } = value;

          dispatch({
            type: 'paperPlan/listPage',
            payload: {
              page: {
                pageNum:1,
                pageSize,
              },
            },
          });
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
        render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:mm:ss') :'-'}</span>,
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
        title: '时长（分钟）',
        dataIndex: 'duration',
        render:(text,record,index)=>
          <span>
            <Form.Item label="">
              {getFieldDecorator(`paperPlanListSaves[${index}].duration`, {
                initialValue: record.duration,
                rules: [{ required: true, message: '请输入时长！' }],
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
                {
                  initialValue:startValue[index]?moment(startValue[index]):null,
                  rules: [{ required: true, message: '请输入计划开始时间！' }],
                }
              )(
                <DatePicker  showTime format="YYYY-MM-DD HH:mm:ss" />,
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
                rules: [{ required: true, message: '请选择批卷教师！' }],
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
              <Row>
                <Col span={24}>
                  <Form.Item label="计划名称:">
                    {getFieldDecorator('planName', {
                      initialValue:planDetail?planDetail.planName:'' ,
                      rules: [{ required: true, message: '请输入计划名称！' }],
                    })(
                      <Input style={{ width: '400px' }}/>
                    )}
                  </Form.Item>

                </Col>
                  <Col span={24}>
              <Form.Item label="发布部门">
                {getFieldDecorator('planDepartId', {
                  initialValue:planDetail?planDetail.planDepartId:'' ,
                  rules: [{ required: true, message: '请选择发布部门！' }],
                })(
                  <TreeSelect
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '300px' }}
                    allowClear
                    onChange={this.treeChange}
                  >
                    {renderDepartTreeNodes(treeDepartData)}
                  </TreeSelect>,
                )}
              </Form.Item>
                  </Col>
                <Col span={24}>
              <span className={styles.chooseExam} onClick={this.selExam}>试卷选择</span>
                </Col>
              </Row>
              <Table
                rowKey={record => `${record.paperId}`}
                columns={columns}
                dataSource={paperPlanListVOList}
                pagination={false}
              />
            </Form>


          </Spin>

          <ExmaListModal examListVisible={examListVisible} getStockInfo={(e) => {this.examListMakeUp(e)}}></ExmaListModal>

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
