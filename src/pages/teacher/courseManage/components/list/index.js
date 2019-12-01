import { connect } from 'dva';
import router from 'umi/router'
import { Pagination, Divider, Empty, Modal } from 'antd';
import OSearchBar from './searchBar';
import OCell from './cell';

const pageSize = 5;
function OList({ total, list, courseName, optionCourseId, optionCourseName, deleteCourseVisible,selectedNodes, loading, dispatch }) {

  const handleEdit = (id) => {
    router.push(`/teacher/courseEdit?id=${id}`)
  };
  const handleDelete = (optionCourseName,optionCourseId) => {
    dispatch({
      type: 'courseManage/save',
      payload: {
        optionCourseName,
        optionCourseId,
        deleteCourseVisible: true
      },
    });
  };

  const HandleDeleteCourse = () => {
    dispatch({
      type: 'courseManage/courseDelete',
      payload: {
        courseId: optionCourseId,
      },
    });
  }

  const handleCancel = () => {
    dispatch({
      type:'courseManage/save',
      payload:{
        deleteCourseVisible:false
      }
    })
  };

  const searchCourse = value => {
    dispatch({
      type: 'courseManage/save',
      payload: {
        ...value,
      },
    });
    dispatch({
      type: 'courseManage/courseListpage',
      payload: {
        ...value,
        categoryId:selectedNodes.categoryId || '',
        page: {
          pageSize,
          pageNum: 1,
        },
      },
    });
  };
  const pageChange = (page, pageSize) => {
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
        categoryId:selectedNodes.categoryId || '',
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  }
  if (!loading && total === 0) {
    return (
      <div>
        <OSearchBar onSearch={searchCourse} />
        <Divider />
        <Empty />
      </div>
    );
  }
  return (
    <div>
      <OSearchBar onSearch={searchCourse} />
      <Divider />
      {list.map(item => {
        return (
          <OCell
            {...item}
            key={item.courseId}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      })}
      <Pagination defaultCurrent={1} total={total} pageSize={pageSize} onChange={pageChange} />
      <Modal
        title="删除课程提示"
        visible={deleteCourseVisible}
        onOk={HandleDeleteCourse}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <p>确定删除{optionCourseName}课程吗？</p>
      </Modal>
    </div>
  );
}

export default connect((state) => ({ ...state.courseManage, loading: state.loading.models.courseManage }))(OList);
