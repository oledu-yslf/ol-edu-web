import React from 'react';
import { Modal, Form, Table, Row, Col,Divider,Input, Select,Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import getUserId from '@/utils/getUserId';
import style from '../index.less'
const { Option } = Select;
class ExamListModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      examType: '',
      difficultyLevel: '',
      examName: '',
    };
  }
  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'newPaperManual/listPage',
      payload: {
        paperName,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        examListVisible: false,
      },
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'save',
      payload: {
        typeList: [],
        questionList: [],
        total: 10,
        plusTypeVisible: false,
        editTypeVisible: false,
        addExamVisible: false,
      },
    });
  }
  handleSubmit = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'newPaperManual/save',
      payload: {
        examListVisible: false,
      },
    });
  }
  render() {
    const {  questionList, total, examListVisible, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '试题名称',
        dataIndex: 'examName',
        key: 'examName',
        width: 200,
        render: text =>(
          <div dangerouslySetInnerHTML={{ __html: text }} />
        )
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
        // render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '上传人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
    ];
    const {
      examType,
      difficultyLevel,
      examName,
    } = this.state;
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        const state = this.state;
        state.searchHistory = selectedRows;
        this.setState(state);
        this.props.getStockInfo(selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    // const hasSelected = selectedRowKeys.length > 0;

    return (
      <Modal
        class={style.box}
        title="新增试卷"
        visible={examListVisible}
        onCancel={this.handleCancel}
        onOk={this.handlePaperPlus}
        confirmLoading={loading}
        width={1000}
      >
        <Row>
        <Col span={24}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="试题类型:">
              {getFieldDecorator('examType', {
                initialValue: examType,
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
                initialValue: difficultyLevel,
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
                initialValue: examName,
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
            rowSelection={rowSelection}
            rowKey={record => record.examId}
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
        </Col>
        </Row>
      </Modal>
    );
  }
}

const ExamListForm = Form.create({ name: 'newPaperForm' })(ExamListModal);

export default connect(state => ({
  ...state.newPaperManual,
  loading: state.loading.models.newPaperManual,
}))(ExamListForm);
