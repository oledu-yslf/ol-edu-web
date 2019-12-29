import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Tabs, Row, Col, Tree, Button, Table, Spin, Form, Input, Select, Divider } from 'antd';
import styles from './index.less';
import getUserId from '@/utils/getUserId';
const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Option } = Select;
class QuestionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      selectedNodes: {},
      examType: '',
      difficultyLevel: '',
      examName: '',
    };
  }
  onTabClick = e => {
    router.push(e);
  };

  /**
   * tree option
   */
  onTypeSelect = (selectedKeys, info) => {
    const { dispatch, courseName } = this.props;

    if (selectedKeys.length > 0) {
      this.setState({ selectedKeys, selectedNodes: info.selectedNodes[0].props.dataRef });
      // dispatch({
      //   type: 'examList/save',
      //   payload: {
      //     selectedNodes: info.selectedNodes[0].props.dataRef,
      //   },
      // });
      // dispatch({
      //   type: 'courseManage/courseListpage',
      //   payload: {
      //     courseName,
      //     // createStaffId: modifyStaffId,
      //     categoryId: info.selectedNodes[0].props.dataRef.categoryId || '',
      //     page: {
      //       pageSize: 5,
      //       pageNum: 1,
      //     },
      //   },
      // });
    } else {
      this.setState({ selectedKeys: [], selectedNodes: {} });
    }
  };
  handleSearchSubmit = (e) => {
    e.preventDefault();
    const { dispatch ,form} = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType,difficultyLevel,examName} = value;

    dispatch({
      type: 'questionList/listPage',
      payload: {
        categoryId: selectedNodes.categoryId,
        examType,
        difficultyLevel,
        examName
      },
    });
  };

  deleteExam = (record,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'questionList/examDelete',
      payload: {
        examId: record.examId,
      },
    });
  }
  newExam = ()=>{
    router.push('/teacher/examEdit');
  }
  queryExam = (record,e)=>{
    router.push(`/teacher/examDetail?examId=${record.examId}`);
  }
  editExam = (record,e)=>{
    router.push(`/teacher/examEdit??examId=${record.examId}`);
  }

  pageChange = (page, pageSize) => {
    const { dispatch ,form} = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType,difficultyLevel,examName} = value;
    dispatch({
      type: 'questionList/listPage',
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
  render() {
    const { typeList, questionList, total, loading, form } = this.props;
    const { selectedKeys, examType, difficultyLevel, examName } = this.state;
    const { getFieldDecorator } = form;

    const renderTreeNodes = data => {
      if (data) {
        return data.map(item => {
          if (item.childExamCategoryList) {
            return (
              <TreeNode
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
            {text === '0'
              ? '易'
              : text === '1'
              ? '较易'
              : text === '2'
              ? '中等'
              : text === '3'
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
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            {/* <a >
              编辑
            </a> */}
            <Button type="link" onClick={e => this.editExam(record, e)}>
              编辑
            </Button>
            {/* <Divider type="vertical" /> */}
            <Button type="link" onClick={e => this.queryExam(record, e)}>
              查看
            </Button>
            {/* <Divider type="vertical" /> */}
            <Button type="link" onClick={e => this.deleteExam(record, e)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.box}>
        <Tabs defaultActiveKey="/teacher/questionList" onTabClick={this.onTabClick}>
          <TabPane tab="基础资料" key="/teacher"></TabPane>
          <TabPane tab="课程管理" key="/teacher/courseManage"></TabPane>
          <TabPane tab="考试管理" key="/teacher/questionList">
            <Spin spinning={loading}>
              <Row gutter={24}>
                <Col span={6}>
                  <Button type="primary" icon="plus" size="small" onClick={this.plusCategory}>
                    增加
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    icon="edit"
                    onClick={this.editCategory}
                    style={{ marginLeft: '5px' }}
                  >
                    编辑
                  </Button>
                  <Button
                    size="small"
                    type="danger"
                    icon="delete"
                    onClick={this.deleteCategory}
                    style={{ marginLeft: '5px' }}
                  >
                    删除
                  </Button>
                  <Tree
                    onSelect={this.onTypeSelect}
                    defaultExpandAll={true}
                    selectedKeys={selectedKeys}
                  >
                    {renderTreeNodes(typeList)}
                  </Tree>
                </Col>
                <Col span={18}>
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
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={this.newExam}
                      >
                        新增试题
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={this.handleSubmit}
                      >
                        导入试题
                      </Button>
                    </Form.Item>
                  </Form>
                  <Divider />

                  <Table
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
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
const QuestionListForm = Form.create({ name: 'QuestionListForm' })(QuestionList);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(QuestionListForm);
