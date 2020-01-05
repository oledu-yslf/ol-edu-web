import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Table, Spin, Form, Input, Select, Divider, Modal, TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;
const { Option } = Select;
class QuestionListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedExams:[]
    };
  }

  handleCancel= e=>{
    const {dispatch} = this.props;
    dispatch({
      type:"newPaperManual/save",
      payload:{
        questionListModalVisbile:false
      }
    })
  }

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const {categoryId, examType, difficultyLevel, examName } = value;

    dispatch({
      type: 'newPaperManual/listPage',
      payload: {
        categoryId,
        examType,
        difficultyLevel,
        examName,
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType, difficultyLevel, examName } = value;
    dispatch({
      type: 'newPaperManual/listPage',
      payload: {
        categoryId: selectedNodes.categoryId,
        examType,
        difficultyLevel,
        examName,
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
        type:'newPaperManual/save',
        payload:{
          selectedExams:selectedRows

      }})
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  render() {
    const { typeList, questionList, total, loading, form ,questionListModalVisbile} = this.props;
    // const { examType, difficultyLevel, examName,  } = this.state;
    const { getFieldDecorator } = form;
    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childExamCategoryList) {
            return (
              <TreeNode
                value={item.categoryId}
                title={item.categoryName}
                key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
                dataRef={item}
              >
                {renderTreeNodes(item.childExamCategoryList)}
              </TreeNode>
            );
          }
          return (
            <TreeNode
              value={item.categoryId}
              title={item.categoryName}
              key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
              dataRef={item}
            />
          );
        });
      }
    };

    const columns = [
      {
        title: '试题名称',
        dataIndex: 'examName',
        key: 'examName',
        width: 200,
        render: text => <div dangerouslySetInnerHTML={{ __html: text }} />,
      },
      {
        title: '试题类型',
        dataIndex: 'examType',
        key: 'examType',
        render: text => (
          <span>
            {text === 1
              ? '单选题'
              : text === 2
              ? '多选题'
              : text === 3
              ? '判断题'
              : text === 4
              ? '问答题'
              : '填空题'}
          </span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '难度',
        dataIndex: 'difficultyLevel',
        key: 'difficultyLevel',
        render: text => (
          <span>
            {text === 0
              ? '易'
              : text === 1
              ? '较易'
              : text === 2
              ? '中等'
              : text === 3
              ? '偏难'
              : '难'}
          </span>
        ),
      },

      {
        title: '分数',
        dataIndex: 'mark',
        key: 'mark',
      },
      {
        title: '上传人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
    ];
    
    return (
      <Modal
        title="删除试题分类提示"
        visible={questionListModalVisbile}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        // confirmLoading={loading}
        width={1200}
      >
        <Spin spinning={loading}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="试题分类">
              {getFieldDecorator('categoryId',
              )(
                <TreeSelect
                  showSearch
                  style={{ width: '160px' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择试题分类!"
                  allowClear
                  onChange={this.treeChange}
                >
                  {renderTreeNodes(typeList)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="试题类型:">
              {getFieldDecorator('examType', {
                // initialValue: examType,
              })(
                <Select style={{ width: '80px' }}>
                  <Option value={''}>全部</Option>
                  <Option value={1}>单选题</Option>
                  <Option value={2}>多选题</Option>
                  <Option value={3}>判断题</Option>
                  <Option value={4}>问答题</Option>
                  <Option value={5}>填空题</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="难度等级:">
              {getFieldDecorator('difficultyLevel', {
                // initialValue: difficultyLevel,
              })(
                <Select style={{ width: '80px' }}>
                  <Option value={''}>全部</Option>
                  <Option value={0}>易</Option>
                  <Option value={1}>较易</Option>
                  <Option value={2}>中等</Option>
                  <Option value={3}>偏难</Option>
                  <Option value={4}>难</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="试题名称:">
              {getFieldDecorator('examName', {
                // initialValue: examName,
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
            rowKey={record => record.examId}
            rowSelection={this.rowSelection}
            columns={columns}
            dataSource={questionList}
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
const QuestionListForm = Form.create({ name: 'questionListForm' })(QuestionListModal);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(QuestionListForm);
