import React from 'react';
import moment from 'moment';
import router from 'umi/router';
import { Tabs, Button, Table, Spin, Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
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
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'paperList/listPage',
      payload: {
        paperName,
      },
    });
  };
  newPaper = () => {
    // router.push('/teacher/paperEdit');
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/save',
      payload: {
        newPaperVisible: true,
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
      type: 'paperList/paperDelete',
      payload: {
        paperId: record.paperId,
      },
    });
  };

  pageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;
    const value = form.getFieldsValue();
    const { paperName } = value;
    dispatch({
      type: 'paperList/listPage',
      payload: {
        paperName,
        page: {
          pageNum: page,
          pageSize: 10,
        },
      },
    });
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'paperList/save',
      payload: {
        paperList: [],
        total: 10,
        newPaperVisible: false,
      },
    });
  }
  render() {
    const { paperList, total, newPaperVisible, loading, form } = this.props;
    const { getFieldDecorator } = form;
    const { paperName } = this.state;
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
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          <span>
            <Button type="link" onClick={e => this.editPaper(record, e)}>
              编辑
            </Button>
            <Button type="link" onClick={e => this.querypaper(record, e)}>
              查看
            </Button>
            <Button type="link" onClick={e => this.deletePaper(record, e)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.box}>
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
                  pageSize: 10,
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
  ...state.paperList,
  loading: state.loading.models.paperList,
}))(PaperListForm);
