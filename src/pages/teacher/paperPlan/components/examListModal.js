import React from 'react';
import { Modal, Form, Table,Input,Select,Button,Spin } from 'antd';
import moment from 'moment';
import * as Util from '@/utils/util';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';

const { Option } = Select;
let selList = []
const ExamListModal = Form.create({
  name: 'EditPeriod',
})(
  class ExamListModal extends React.Component {
    constructor(props) {
      super(props);
    }
    onOk = () => {
      const {dispatch} = this.props;
      // this.props.getStockInfo(selList)
      dispatch({
        type:'paperPlan/save',
        payload:{
          examListVisible:false
        }
      })
    };
    onClose = () => {
      const {dispatch} = this.props;
      dispatch({
        type:'paperPlan/save',
        payload:{
          examListVisible:false
        }
      })
    };
    queryExamList = e =>{
      const { dispatch, form, pageSize } = this.props;
      const value = form.getFieldsValue();
      dispatch({
        type: 'paperPlan/examList',
        payload: {
          paperType:value.paperType,
          paperName:value.paperName,
          page: {
            pageNum: 1,
            pageSize,
          },
          createStaffId: Util.getStaffId(),
        },
      });
    }

    pageChange = (page) => {
      const { dispatch, form, pageSize } = this.props;
      const value = form.getFieldsValue();
      dispatch({
        type: 'paperPlan/examList',
        payload: {
          paperType:value.paperType,
          paperName:value.paperName,
          page: {
            pageNum: page,
            pageSize,
          },
          createStaffId: Util.getStaffId(),
        },
      });
    };
    initChecked = (record) => {
      const { paperPlanListVOList } = this.props;
      for (let i in paperPlanListVOList){
        if (paperPlanListVOList[i].paperId == record.paperId){
          return true;
        }
      }
      return false;
    }
    addExamToPaper = (record) => {
      const { paperPlanListVOList,dispatch} = this.props;
      //////////////////////////////
      if(paperPlanListVOList.length == 0){
        //构造试题对象
        let obj = {};
        obj.paperVO = {};
        obj.paperVO.paperName = record.paperName;
        obj.paperVO.paperType = record.paperType;
        obj.paperVO.totalScore = record.totalScore;
        obj.paperVO.createStaffName = record.createStaffName;
        obj.createDate = record.createDate
        obj.paperId = record.paperId


        paperPlanListVOList.push(obj);

      } else {
        for (let i in paperPlanListVOList){
          if(paperPlanListVOList[i].paperId == record.paperId){
            return ;
          }
        }
        let obj = {};
        obj.paperVO = {};
        obj.paperVO.paperName = record.paperName;
        obj.paperVO.paperType = record.paperType;
        obj.paperVO.totalScore = record.totalScore;
        obj.paperVO.createStaffName = record.createStaffName;
        obj.createDate = record.createDate
        obj.paperId = record.paperId
        paperPlanListVOList.push(obj);
      }

      let newPaperExamSummery = [];
      paperPlanListVOList.map((item,k) => {
        newPaperExamSummery[k] = cloneDeep(item);
      })

      dispatch({
        type: 'paperPlan/save',
        payload: {
          paperPlanListVOList:newPaperExamSummery
        },
      });

    }
    removeExamToPaper = (record) => {
      const { paperPlanListVOList,dispatch} = this.props;
      //////////////////////////////
      if(paperPlanListVOList == null){
        return ;
      } else {


        for (let i in paperPlanListVOList){
          if (paperPlanListVOList[i].paperId == record.paperId){
            paperPlanListVOList.splice(i,1);
            break;
          }
        }

        let newPaperExamSummery = [];
        paperPlanListVOList.map((item,k) => {
          if (item){
            newPaperExamSummery[k] = cloneDeep(item);
          }

        })

        dispatch({
          type: 'paperPlan/save',
          payload: {
            paperExamSummery:newPaperExamSummery
          },
        });
      }
    }

    selectAll = (selected,changeRows) => {
      if (selected == true){
        for (let i in changeRows){
          this.addExamToPaper(changeRows[i]);
        }
      } else {
        for (let i in changeRows){
          this.removeExamToPaper(changeRows[i]);
        }
      }
    }
    render() {
      const { confirmLoading, examList,examListVisible,examListTotal, form, paperPlanListVOList, dispatch, pageSize, loading} = this.props;
      const { getFieldDecorator } = form;

      const columns = [
        {
          title: '序号',
          dataIndex: '',
          render: (text,record,index) => {
            return <span>{Number(index)+1}</span>
          }

        },
        {
          title: '试卷名称',
          dataIndex: 'paperName',
        },
        {
          title: '试卷类型',
          dataIndex: 'paperType',
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
          title: '及格分数',
          dataIndex: 'passScore',
        },
        {
          title: '分数',
          dataIndex: 'totalScore',
        },
        {
          title: '创建人员',
          dataIndex: 'createStaffName',
        },

      ];

      const rowSelection = {
        onSelect:(record, selected, selectedRows, nativeEvent) => {

          if (selected == true){
            this.addExamToPaper(record)
          } else {
            this.removeExamToPaper(record)
          }


        },
        onSelectAll:(selected, selectedRows, changeRows) => {
          this.selectAll(selected,changeRows);
        },

        getCheckboxProps: record => ({
          defaultChecked:this.initChecked(record),    //设置默认选中项
        }),

      };

      return (
        <Modal
          visible={examListVisible}
          title={'试卷列表'}
          okText="保存"
          cancelText="取消"
          onCancel={this.onClose}
          onOk={this.onOk}
          confirmLoading={loading}
          width={1000}
          destroyOnClose
          footer={null}
        >
          <Spin spinning={loading}>

          <Form layout="inline">
            <Form.Item label="试卷名称:">
              {getFieldDecorator('paperName')(<Input style={{ width: '200px' }} />)}
            </Form.Item>
            <Form.Item label="试卷类型:">
              {getFieldDecorator('paperType')
              (<Select style={{ width: '120px' }}>
                <Option value={''}>全部</Option>
                <Option value={0}>作业</Option>
                <Option value={1}>试卷</Option>
              </Select>)}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.queryExamList}
              >
                查询
              </Button>
            </Form.Item>
          </Form>
          <Table
            rowSelection={rowSelection}
            rowKey={record => `${record.paperId}`}
            columns={columns}
            dataSource={examList}
            pagination={{
              total:examListTotal,
              pageSize: pageSize,
              onChange: page => {
                this.pageChange(page);
              },
            }}
          />
          </Spin>
        </Modal>
      );
    }
  },
);

const ExamListModalForm = Form.create({ name: 'examListModalForm' })(ExamListModal);

export default connect(state => ({
  ...state.paperPlan,
  loading: state.loading.models.paperPlan,
}))(ExamListModalForm);
