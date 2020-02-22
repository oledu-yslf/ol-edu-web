import React from 'react';
import { Modal, Form, Table,Input,Select,Button } from 'antd';
import moment from 'moment';
import * as Util from '@/utils/util';
import { connect } from 'dva';


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
      this.props.getStockInfo(selList)
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
      const { dispatch, form } = this.props;
      const value = form.getFieldsValue();
      dispatch({
        type: 'paperPlan/examList',
        payload: {
          paperType:value.paperType,
          paperName:value.paperName,
          page: {
            pageNum: 1,
            pageSize: 10,
          },
          createStaffId: Util.getStaffId(),
        },
      });
    }

    pageChange = (page, pageSize) => {
      const { dispatch, form } = this.props;
      const value = form.getFieldsValue();
      dispatch({
        type: 'paperPlan/examList',
        payload: {
          paperType:value.paperType,
          paperName:value.paperName,
          page: {
            pageNum: page,
            pageSize: pageSize,
          },
          createStaffId: Util.getStaffId(),
        },
      });
    };


    render() {
      const { confirmLoading, examList,examListVisible,examListTotal, form} = this.props;
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
          render: text => <span>{text ?moment(parseInt(text)).format('YYYY-MM-DD HH:MM:ss') :'-'}</span>,
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
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);


          console.log(examList.findIndex((item,index) => item.paperId == selectedRowKeys))

          // examList.splice(examList.findIndex((item,index) => item.paperId == selectedRowKeys), 1)
          selList = []
          selList = selectedRows
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
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
          confirmLoading={confirmLoading}
          width={1000}
        >
          <Form layout="inline">
            <Form.Item label="试题名称:">
              {getFieldDecorator('paperType')(<Input style={{ width: '120px' }} />)}
            </Form.Item>
            <Form.Item label="试题类型:">
              {getFieldDecorator('paperName')
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
              pageSize: 10,
              onChange: page => {
                this.pageChange(page);
              },
            }}
          />
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
