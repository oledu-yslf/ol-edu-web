import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Table, Spin, Form, Input, Select, Divider, Modal } from 'antd';

const { Option } = Select;
class PaperListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedExams:[]
    };
  }

  handleCancel= e=>{
    const {dispatch} = this.props;
    dispatch({
      type:"newPlan/save",
      payload:{
        paperListModalVisbile:false
      }
    })
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const {paperType,paperName } = value;
    dispatch({
      type: 'newPlan/listPage',
      payload: {
        paperType,paperName
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperType,paperName } = value;
    dispatch({
      type: 'newPlan/listPage',
      payload: {
        paperType,paperName,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const { dispatch, form } = this.props;
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      dispatch({
        type:'newPlan/save',
        payload:{
          selectedPaper:selectedRows
      }})
    },
  
  };
  render() {
    const { paperList, total, loading, form ,paperListModalVisbile} = this.props;
    const { getFieldDecorator } = form;
    

    const columns = [
      {
        title: '试卷名称',
        dataIndex: 'paperName',
        key: 'paperName',
      },
      {
        title: '试卷类型',
        dataIndex: 'paperType',
        key: 'paperType',
        render: text => <span>{text === 0 ? '作业' : '试卷'}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '及格分数',
        dataIndex: 'passScore',
        key: 'passScore',
      },

      {
        title: '分数',
        dataIndex: 'totalScore',
        key: 'totalScore',
      },
      {
        title: '创建人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      }
    ];
    
    return (
      <Modal
        title="删除试题分类提示"
        visible={paperListModalVisbile}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        // confirmLoading={loading}
        width={1200}
      >
        <Spin spinning={loading}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            
            <Form.Item label="试卷类型:">
              {getFieldDecorator('paperType', {
              })(
                <Select style={{ width: '80px' }}>
                  <Option value={''}>全部</Option>
                  <Option value={0}>作业</Option>
                  <Option value={1}>试卷</Option>
                </Select>,
              )}
            </Form.Item>
           
            <Form.Item label="试卷名称:">
              {getFieldDecorator('paperName', {
              })(<Input style={{ width: '120px' }} />)}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.handleSearchSubmit}
              >
                查询
              </Button>
            </Form.Item>
          </Form>
          <Divider />

          <Table
            rowKey={record => record.paperId}
            rowSelection={this.rowSelection}
            columns={columns}
            dataSource={paperList}
            pagination={{
              total,
              pageSize: 10,
              onChange: (page, pageSize) => {
                this.pageChange(page, pageSize);
              },
            }}
          />
        </Spin>
      </Modal>
    );
  }
}
const PaperListModalForm = Form.create({ name: 'paperListForm' })(PaperListModal);

export default connect(state => ({
  ...state.newPlan,
  loading: state.loading.models.newPlan,
}))(PaperListModalForm);
