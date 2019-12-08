import React from 'react';
import { Tree, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import PlusModal from './plusModal';
import EditPeriodModal from './editPeriodModal';
const { TreeNode } = Tree;

class OTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: '',
      nodeName: '',
    };
  }

  renderTreeNodes = data => {
    if (data){
      return data.map(item => {
        if (item.periodVOList) {
          return (
            <TreeNode title={item.chapterName} key={`章节-${item.chapterId}`} dataRef={item}>
              {this.renderTreeNodes(item.periodVOList)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.periodName}
            key={`课时-${item.periodId}`}
            dataRef={item}
            isLeaf={true}
          />
        );
      });
    }

  };

  /**
   * tree option
   */
  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    let isLeaf, id;
    if (selectedKeys.length > 0) {
      isLeaf = selectedKeys[0].split('-')[0] === '章节' ? false : true;
      id = selectedKeys[0].split('-')[1];
      dispatch({
        type: 'courseDetail/save',
        payload: {
          selectedKeys,
          isSelectedNode: true,
          isLeaf,
        },
      });
      if (isLeaf) {
        dispatch({
          type: 'courseDetail/periodDetail',
          payload: {
            id,
          },
        });
      } else {
        dispatch({
          type: 'courseDetail/chapterDetail',
          payload: {
            id,
          },
        });
        dispatch({
          type: 'courseDetail/save',
          payload: {
            periodDetail: {},
          },
        });
      }
    } else {
      dispatch({
        type: 'courseDetail/save',
        payload: {
          selectedKeys: [],
          isSelectedNode: false,
          isLeaf: false,
          chapterDetail: {},
          periodDetail: {},
        },
      });
    }
  };

  /**
   * button option
   */
  plusChapter = () => {
    const { dispatch, isSelectedNode, isLeaf } = this.props;
    if (!isSelectedNode) {
      this.setState({
        modalTitle: '创建章节',
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          plusVisible: true,
        },
      });
    } else if (isSelectedNode && !isLeaf) {
      this.setState({
        modalTitle: '创建课时',
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          editPeriod: true,
        },
      });
    } else {
      message.warning('创建章节请取消选择的节点！创建课时请选择章节节点！');
    }
  };
  editChapter = () => {
    const { dispatch, isSelectedNode, isLeaf } = this.props;
    if (isSelectedNode && !isLeaf) {
      this.setState({
        modalTitle: '编辑章节',
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          plusVisible: true,
        },
      });
    } else if (isSelectedNode && isLeaf) {
      this.setState({
        modalTitle: '编辑课时',
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          editPeriod: true,
        },
      });
    } else {
      message.warning('请先选择操作节点');
    }
  };
  deleteCategory = () => {
    const { dispatch, isSelectedNode, isLeaf, chapterDetail, periodDetail } = this.props;

    if (isSelectedNode && !isLeaf) {
      const nodeName = `确定删除${chapterDetail.chapterName}章节吗?该操作会删除章节下的所有课时`;
      this.setState({
        modalTitle: '删除章节',
        nodeName,
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          deleteVisible: true,
        },
      });
    } else if (isSelectedNode && isLeaf) {
      const nodeName = `确定删除${periodDetail.periodName}课时吗?`;
      this.setState({
        modalTitle: '删除课时',
        nodeName,
      });
      dispatch({
        type: 'courseDetail/save',
        payload: {
          deleteVisible: true,
        },
      });
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  /**
   * modals option
   */
  handleCreate = value => {
    const { dispatch, courseDetail } = this.props;
    const { chapterName, chapterDesc, sort } = value;
    dispatch({
      type: 'courseDetail/chapterSave',
      payload: {
        courseId: courseDetail.courseId, //课程ID
        chapterId: '',
        state: 1, //状态，填写为1，表示正常正泰
        chapterName,
        chapterDesc,
        totalPeriod: 0, //课时个数，新增时候填0
        sort, //排序，课程下面章节的排序
        createStaffId: '0001',
      },
    });
  };

  handleUpdate = value => {
    const { chapterName, chapterDesc, sort } = value;
    const { dispatch, chapterDetail, courseDetail } = this.props;
    const chapterId = chapterDetail.chapterId;
    const courseId = courseDetail.courseId;
    dispatch({
      type: 'courseDetail/chapterUpdate',
      payload: {
        courseId, //课程IDs
        chapterId,
        state: 1, //状态，填写为1，表示正常正泰
        chapterName,
        chapterDesc,
        sort, //排序，课程下面章节的排序
        createStaffId: '0001',
      },
    });
  };
  handleCreatePeriod = value => {
    console.log(value);
    const { periodName, periodDesc, sort } = value;
    const { dispatch, chapterDetail, courseDetail } = this.props;
    const chapterId = chapterDetail.chapterId;
    const courseId = courseDetail.courseId;
    const videoFileId = value.videoFileId;
    const attachFileId = value.attachFileId;

    let vFileId,aFileId;
    if(videoFileId.length>0){
      vFileId = videoFileId[0].uid;
    }
    if(attachFileId.length>0){
      aFileId = attachFileId[0].uid;

    }
    // const aFileId = attachFileId[0].uid;
    debugger;
    dispatch({
      type: 'courseDetail/periodSave',
      payload: {
        courseId,
        chapterId,
        periodName, //状态，填写为1，表示正常正泰
        periodDesc,
        videoFileId: vFileId,
        attachFileId: aFileId, //课时个数，新增时候填0
        sort, //排序，课程下面章节的排序
        isFree: 1,
        isPutaway: 1,
        createStaffId: '0001',
      },
    });
  };

  handleUpdatePeriod = value => {
    const { periodName, periodDesc, videoFileId, attachFileId, sort } = value;
    const { dispatch, periodDetail, chapterDetail } = this.props;
    debugger;
    // var chapterId = this.state.selectedNodes.chapterId;
    const vFileId = videoFileId[0].uid;
    const aFileId = attachFileId[0].uid;
    dispatch({
      type: 'courseDetail/periodUpdate',
      payload: {
        chapterId: chapterDetail.chapterId,
        periodId: periodDetail.periodId,
        periodName, //状态，填写为1，表示正常正泰
        periodDesc,
        videoFileId: vFileId,
        attachFileId: aFileId, //课时个数，新增时候填0
        sort, //排序，课程下面章节的排序
        isFree: 1,
        isPutaway: 1,
        modifyStaffId: '0001',
      },
    });
  };
  HandleDelete = () => {
    const { dispatch, isSelectedNode, isLeaf, chapterDetail, periodDetail } = this.props;
    if (isSelectedNode && !isLeaf) {
    
      dispatch({
        type: 'courseDetail/chapterDelete',
        payload: {
          chapterId: chapterDetail.chapterId,
        },
      });
    } else if (isSelectedNode && isLeaf) {
      dispatch({
        type: 'courseDetail/periodDelete',
        payload: {
          id: periodDetail.periodId,
        },
      });
    }
  };
  uploadFile = fileList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseDetail/save',
      payload: {
        fileList,
      },
    });
  };
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseDetail/save',
      payload: {
        plusVisible: false,
        deleteVisible: false,
        editPeriod: false,
      },
    });
  };

  render() {
    const { modalTitle, nodeName } = this.state;

    const {
      chapterDetail,
      periodDetail,
      selectedKeys,
      treeData,
      plusVisible,
      deleteVisible,
      editPeriod,
      loading,
    } = this.props;
    return (
      <div>
        <Button type="primary" icon="plus" size="small" onClick={this.plusChapter}>
          增加
        </Button>
        <Button
          size="small"
          type="primary"
          icon="edit"
          onClick={this.editChapter}
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
        {treeData.length ? (
          <Tree
            // loadData={this.onLoadData}s
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        ) : (
          ''
        )}

        <PlusModal
          title={modalTitle}
          visible={plusVisible}
          chapterDetail={chapterDetail}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onEdit={this.handleUpdate}
          confirmLoading={loading}
        />
        <EditPeriodModal
          title={modalTitle}
          visible={editPeriod}
          periodDetail={periodDetail}
          onCancel={this.handleCancel}
          onCreate={this.handleCreatePeriod}
          onEdit={this.handleUpdatePeriod}
          confirmLoading={loading}
        />
        <Modal
          title={modalTitle}
          visible={deleteVisible}
          onOk={this.HandleDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>{nodeName}</p>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.courseDetail,
  loading: state.loading.models.courseDetail,
}))(OTree);
