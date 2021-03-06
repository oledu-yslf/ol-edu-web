import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Tabs,
  Row,
  Col,
  Tree,
  Button,
  Table,
  Spin,
  Form,
  Input,
  Select,
  Divider,
  Modal,
  message,
  Upload,
  Icon,
  notification,
} from 'antd';
import PlusTypeModal from './components/plusTypeModal';
import EditTypeModal from './components/editTypeModal';
import AddExamModal from './components/addExamModal';
import * as Util from '@/utils/util';
import styles from '@/style/common.less';

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
      deleteTypeVisible: false,
      uploadVisible: false,
      fileList:[],
    };
  }

  componentWillMount() {
    const { dispatch,pageSize } = this.props;
    dispatch({
      type: 'questionList/init',
      payload:{
        page:{
          pageNum:1,
          pageSize,
      }
    }
  });
  }

  onTabClick = e => {
    router.push(e);
  };

  /**
   * tree option
   */
  onTypeSelect = (selectedKeys, info) => {
    const { dispatch, form,pageSize } = this.props;
    const value = form.getFieldsValue();
    const { examType, difficultyLevel, examName } = value;
    if (selectedKeys.length > 0) {
      this.setState({ selectedKeys, selectedNodes: info.selectedNodes[0].props.dataRef });
      dispatch({
        type: 'questionList/listPage',
        payload: {
          categoryId: info.selectedNodes[0].props.dataRef.categoryId,
          examType,
          difficultyLevel,
          examName,
          page:{
            pageNum: 1,
            pageSize,
          }
        },
      });
    } else {
      this.setState({ selectedKeys: [], selectedNodes: {} });
    }
  };
  plusType = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionList/save',
      payload: {
        plusTypeVisible: true,
      },
    });
  };
  editType = e => {
    const { dispatch } = this.props;
    const { selectedKeys } = this.state;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'questionList/save',
        payload: {
          editTypeVisible: true,
        },
      });
    } else {
      message.warning('请先选择试题分类！');
    }
  };
  addExam = e => {
    const { dispatch } = this.props;
    const { selectedKeys } = this.state;
    if (selectedKeys.length > 0) {
      dispatch({
        type: 'questionList/save',
        payload: {
          addExamVisible: true,
          examDetail:{}
        },
      });
    } else {
      message.warning('请先选择试题分类！');
    }
  };

  deleteType = e => {
    const { selectedKeys } = this.state;
    if (selectedKeys.length > 0) {
      this.setState({
        deleteTypeVisible: true,
      });
    } else {
      message.warning('请先选择试题分类！');
    }
  };

  handleImport= e =>{
    const { selectedKeys } = this.state;
    if (selectedKeys.length > 0) {
      this.setState({
        uploadVisible: true,
        fileList:[],
      });
      this.props.form.resetFields();
    } else {
      message.warning('请先选择试题分类！');
    }
  };

  HandleTypeDelete = e => {
    const { dispatch, form } = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType, difficultyLevel, examName } = value;

    dispatch({
      type: 'questionList/categoryDelete',
      payload: {
        categoryId: selectedNodes.categoryId,
        examType,
        difficultyLevel,
        examName,
      },
    });
    this.handleCancel();
    this.setState({
      selectedKeys: [],
      selectedNodes: {},
    });
  };

  handleCancel = e => {
    this.setState({
      deleteTypeVisible: false,
      uploadVisible: false,
      fileList:[],
    });
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form ,pageSize } = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType, difficultyLevel, examName } = value;

    dispatch({
      type: 'questionList/listPage',
      payload: {
        categoryId: selectedNodes.categoryId,
        examType,
        difficultyLevel,
        examName,
        page:{
          pageNum: 1,
          pageSize,
        }
      },
    });
  };

  deleteExam = (record, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionList/examDelete',
      payload: {
        examId: record.examId,
      },
    });
  };
  newExam = () => {
    router.push('/teacher/questionEdit');
  };
  queryExam = (record, e) => {
    router.push(`/teacher/questionDetail?examId=${record.examId}`);
  };
  editExam = (record, e) => {
    // router.push(`/teacher/questionEdit?examId=${record.examId}`);
    const { dispatch } = this.props;
    const { selectedNodes } = this.state;
    dispatch({
      type: 'questionList/examDetail',
      payload: {
        examId:`${record.examId}`
      },

    }).then (res => {
      dispatch({
        type: 'questionList/save',
        payload: {
          categoryId: selectedNodes.categoryId,
          addExamVisible: true,
          examId:`${record.examId}`
        },

      });
    });


  };

  handleImportExam=()=>{
    this.handleImportExamSubmit()
  }

  handleImportExamSubmit = () =>{
    const { dispatch, form } = this.props;
    const { selectedNodes,fileList } = this.state;
    const value = form.getFieldsValue();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const {examType, difficultyLevel, examName} = value;

        const createStaffId = Util.getStaffId();
        let param = new FormData();
        param.append('categoryId',selectedNodes.categoryId);
        param.append('createStaffId',createStaffId);
        param.append('file',fileList[0]);

        dispatch({
          type: 'questionList/importExam',
          payload:param
        }).then ( (res) => {
          if(res.code === 200){
            notification.success({
              message: '导入成功',
              description: res.data,
            });
            dispatch({
              type: 'questionList/listAll',
            })
          } else {
            notification.error({
              message: '导入失败',
              description: res.msg,
            });
          }

          this.setState({uploadVisible: false});
        });

      }


    })
  }

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const { selectedNodes } = this.state;
    const value = form.getFieldsValue();
    const { examType, difficultyLevel, examName } = value;
    dispatch({
      type: 'questionList/listPage',
      payload: {
        categoryId: selectedNodes.categoryId,
        examType,
        difficultyLevel,
        examName,
        page: {
          pageNum: page,
          pageSize
        },
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


  beforeUpload = (file) => {
    let fileList = [];
    fileList[0] = file;

    this.setState({fileList});

    return false;
  }

  render() {
    const {
      typeList,
      questionList,
      total,
      loading,
      form,
      plusTypeVisible,
      editTypeVisible,
      addExamVisible,
      pageSize,
      pageNum,
    } = this.props;
    const {
      selectedKeys,
      selectedNodes,
      examType,
      difficultyLevel,
      examName,
      deleteTypeVisible,
      uploadVisible,
      fileList,
    } = this.state;
    const {getFieldDecorator} = form;

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
        key:'index',
        title: '序号',
        width:80,
        render:(text,record,index)=> {
          return(
            `${(pageNum-1)*pageSize+(index+1)}` //当前页数减1乘以每一页页数再加当前页序号+1
          )
        }
      },
      {
        title: '试题名称',
        dataIndex: 'examName',
        key: 'examName',
        width: 300,
        render: text => (
          <div dangerouslySetInnerHTML={{__html: text}}/>
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
        title: '创建人员',
        key: 'createStaffName',
        dataIndex: 'createStaffName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <a type="link" onClick={e => this.editExam(record, e)}>
              编辑
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.queryExam(record, e)}>
              查看
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.deleteExam(record, e)}>
              删除
            </a>
          </span>
        ),
      },
    ];

    return (
      <div className={styles.box}>
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={6}>
              <Button type="primary" icon="plus" size="small" onClick={this.plusType}>
                增加
              </Button>
              <Button
                size="small"
                type="primary"
                icon="edit"
                onClick={this.editType}
                style={{marginLeft: '5px'}}
              >
                编辑
              </Button>
              <Button
                size="small"
                type="danger"
                icon="delete"
                onClick={this.deleteType}
                style={{marginLeft: '5px'}}
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
                    <Select style={{width: '80px'}}>
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
                    <Select style={{width: '80px'}}>
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
                  })(<Input style={{width: '120px'}}/>)}
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
                  <Button type="primary" htmlType="submit" onClick={this.addExam}>
                    新增试题
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" onClick={this.handleImport}>
                    导入试题
                  </Button>
                </Form.Item>
              </Form>
              <Divider style = {{marginTop: '2px',marginBottom: '2px'}}/>

              <Table
                rowKey={record => record.examId}
                columns={columns}
                dataSource={questionList}
                pagination={{
                  total,
                  pageSize,
                  onChange: (page, pageSize) => {
                    this.pageChange(page, pageSize);
                  },
                }}
              />
            </Col>
          </Row>
        </Spin>

        <PlusTypeModal plusTypeVisible={plusTypeVisible} selectedNodes={selectedNodes}/>
        <EditTypeModal editTypeVisible={editTypeVisible} selectedNodes={selectedNodes}/>
        <AddExamModal addExamVisible={addExamVisible} selectedNodes={selectedNodes}/>

        <Modal
          title="删除试题分类提示"
          visible={deleteTypeVisible}
          onOk={this.HandleTypeDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>
            删除{selectedNodes.categoryName}
            分类会一并删除对应的试题，以及下面的子分类,确定删除分类吗？
          </p>
        </Modal>

        <Modal
          title="导入试题"
          visible={uploadVisible}
          onOk={this.handleImportExam}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <Row>
            <Col span={4}>模板下载</Col>
            <Col span={20}><a href={require('@/assets/file/试题导入模板.docx')} target='_blank'>试题导入模板.docx</a></Col>
          </Row>
          <Form layout={'vertical'}>
            <Form.Item>
              {getFieldDecorator('importFile', {
                //valuePropName: 'fileList',
                rules: [{required: true, message: '请上传文件'}],
              })(
                <Upload
                  accept=".docx"
                  fileList={fileList}
                  beforeUpload={this.beforeUpload}
                >
                  <Button>
                    <Icon type="upload"/>上传文件
                  </Button>
                </Upload>
              )}
            </Form.Item>
          </Form>
        </Modal>

      </div>
    );
  }
}
const QuestionListForm = Form.create({ name: 'QuestionListForm' })(QuestionList);

export default connect(state => ({
  ...state.questionList,
  loading: state.loading.models.questionList,
}))(QuestionListForm);
