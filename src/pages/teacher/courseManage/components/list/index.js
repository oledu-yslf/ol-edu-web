import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Divider, Modal, List, notification } from 'antd';
import OSearchBar from './searchBar';
import OCell from './cell';

const pageSize = 5;
class OList extends React.Component {
  handleEdit = id => {
    router.push(`/teacher/courseEdit?id=${id}`);
  };
  handleDelete = (optionCourseName, optionCourseId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseManage/save',
      payload: {
        optionCourseName,
        optionCourseId,
        deleteCourseVisible: true,
      },
    });
  };

  HandleDeleteCourse = () => {
    const { dispatch, optionCourseId } = this.props;
    dispatch({
      type: 'courseManage/courseDelete',
      payload: {
        courseId: optionCourseId,
      },
    });
  };
  handleSwitchClick = (optionCourseName, optionCourseId, isPutaway) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseManage/save',
      payload: {
        optionCourseName,
        optionCourseId,
        isPutaway,
        putawayVisible: true,
      },
    });
  };
  handlePutawayCourse = () => {
    const { dispatch, optionCourseId, isPutaway,courseName,selectedNodes } = this.props;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const modifyStaffId = roleInfo.staffId || '';
    dispatch({
      type: 'courseManage/courseUpdate',
      payload: {
        courseId: optionCourseId,
        isPutaway,
        modifyStaffId,
      },
    }).then(res => {
      notification.success({
        message: '成功'
      });
      this.handleCancel();
      dispatch({
        type: 'courseManage/courseListpage',
        payload: {
          courseName,
          createStaffId:modifyStaffId,
          categoryId: selectedNodes.categoryId || '',
          page: {
            pageSize,
            pageNum: 1,
          },
        },
      });
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseManage/save',
      payload: {
        deleteCourseVisible: false,
        putawayVisible: false,
        optionCourseName: '',
        optionCourseId: '',
        isPutaway: '',
      },
    });
  };

  searchCourse = value => {
    const { dispatch, selectedNodes } = this.props;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const modifyStaffId = roleInfo.staffId || '';
    dispatch({
      type: 'courseManage/save',
      payload: {
        ...value,
      },
    });
    dispatch({
      type: 'courseManage/courseListpage',
      payload: {
        createStaffId:modifyStaffId,
        ...value,
        categoryId: selectedNodes.categoryId || '',
        page: {
          pageSize,
          pageNum: 1,
        },
      },
    });
  };
  pageChange = (page, pageSize) => {
    const { courseName, dispatch, selectedNodes } = this.props;
    const roleInfo = sessionStorage.getItem('roleInfo')
      ? JSON.parse(sessionStorage.getItem('roleInfo'))
      : '';
    const modifyStaffId = roleInfo.staffId || '';
    dispatch({
      type: 'courseManage/save',
      payload: {
        pageNum: page,
      },
    });
    dispatch({
      type: 'courseManage/courseListpage',
      payload: {
        courseName,
        createStaffId:modifyStaffId,
        categoryId: selectedNodes.categoryId || '',
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  };
  render() {
    const { list, optionCourseName, putawayVisible, deleteCourseVisible, loading } = this.props;
    return (
      <div>
        <OSearchBar onSearch={this.searchCourse} />
        <Divider />
        <List
          dataSource={list}
          pagination={{
            onChange: page => {
              this.pageChange(page);
            },
          }}
          renderItem={item => (
            <List.Item>
              <OCell
                {...item}
                key={item.courseId}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
                handleSwitchClick={this.handleSwitchClick}
              />
            </List.Item>
          )}
        />
        <Modal
          title="删除课程提示"
          visible={deleteCourseVisible}
          onOk={this.HandleDeleteCourse}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>确定删除'{optionCourseName}'课程吗？</p>
        </Modal>
        <Modal
          title="提示"
          visible={putawayVisible}
          onOk={this.handlePutawayCourse}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>确定 ???上架、下架？'{optionCourseName}'课程吗？</p>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.courseManage,
  loading: state.loading.models.courseManage,
}))(OList);
