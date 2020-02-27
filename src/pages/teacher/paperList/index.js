import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import styles from '@/style/common.less';
import NewPaperModal from './components/newPaperModal';
const { TabPane } = Tabs;

class PaperList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperName: '',
    };
  }
  onTabClick = e => {
    router.push(e);
  };
  handleRouterChange = e => {
    console.log(e);
    router.push(e.target.value);
  };
  handleSearchSubmit = e => {
    e.preventDefault();
    const { dispatch, form ,pageSize} = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'teacherPaperList/paperListPage',
      payload: {
        paperName,
        page :{
          pageNum:1,
          pageSize,
        }
      },
    });
  };
  newPaper = () => {
    // router.push('/teacher/paperEdit');
    const { dispatch } = this.props;
    dispatch({
      type: 'teacherPaperList/save',
      payload: {
        newPaperVisible: true,
        newPaperStep:1
      },
    });
  };
  querypaper = record => {
    router.push(`/teacher/paperDetail?paperId=${record.paperId}`);
  };
  editPaper = record => {
    router.push(`/teacher/newPaperManual?paperId=${record.paperId}`);
  };
  deletePaper = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacherPaperList/paperDelete',
      payload: {
        paperId: record.paperId,
      },
    }).then (res => {
      const { form ,pageSize,pageNum} = this.props;
      const value = form.getFieldsValue();
      const { paperName } = value;
      dispatch({
        type: 'teacherPaperList/paperListPage',
        payload: {
          paperName,
          page :{
            pageNum,
            pageSize,
          }
        },
      });
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'teacherPaperList/paperListPage',
      payload: {
        paperName,
        page: {
          pageNum: page,
          pageSize
        },
      },
    });
  };

  componentWillMount() {
    const { dispatch,pageNum,pageSize } = this.props;
    dispatch({
      type: 'teacherPaperList/paperListPage',
      payload: {
        page:{
          pageNum,
          pageSize,
        }
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teacherPaperList/save',
      payload: {
        paperList: [],
        total: 10,
        newPaperVisible: false,
      },
    });
  }
  render() {
    const { paperList, total, newPaperVisible, loading, form ,pageNum,pageSize} = this.props;
    const { getFieldDecorator } = form;
    const { paperName } = this.state;
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
        render: text => <span>{moment(parseInt(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        width:140,
        render: (text, record) => (
          <span>
            <a type="link" onClick={e => this.editPaper(record, e)}>
              编辑
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.querypaper(record, e)}>
              查看
            </a>
            <span style={{ marginRight: '5px' }}></span>
            <a type="link" onClick={e => this.deletePaper(record, e)}>
              删除
            </a>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.box} style={{marginTop:'20px'}}>
            <Radio.Group
              defaultValue="/teacher/paperList"
              onChange={this.handleRouterChange}
              style={{ marginBottom: '20px' }}
            >
              <Radio.Button value="/teacher/paperList">试卷添加</Radio.Button>
              <Radio.Button value="/teacher/paperPlan">试卷发布</Radio.Button>
            </Radio.Group>
            <Form layout="inline">
              <Form.Item label="试题名称:">
                {getFieldDecorator('paperName', {
                  initialValue: paperName,
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
                <Button type="primary" htmlType="submit" onClick={this.newPaper}>
                  新增
                </Button>
              </Form.Item>
            </Form>
            <Spin spinning={loading}>
              <Table
                rowKey={record => record.paperId}
                columns={columns}
                dataSource={paperList}
                pagination={{
                  total,
                  pageSize,
                  onChange: (page, pageSize) => {
                    this.pageChange(page, pageSize);
                  },
                }}
              />
            </Spin>

        <NewPaperModal newPaperVisible={newPaperVisible} />
      </div>
    );
  }
}

const PaperListForm = Form.create({ name: 'PaperListForm' })(PaperList);

export default connect(state => ({
  ...state.teacherPaperList,
  loading: state.loading.models.teacherPaperList,
}))(PaperListForm);
