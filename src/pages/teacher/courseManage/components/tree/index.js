import React from 'react';
import { Tree, Button, message, Modal } from 'antd';
import { connect } from 'dva';
import PlusModal from './plusModal';
import EditModal from './editModal';

const { TreeNode } = Tree;

class OTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData:[],
      autoExpandParent: true,
      selectedKeys: [],
      modalTitle:''
    };
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.courseCategoryVOList) {
        return (
          <TreeNode
            title={item.categoryName}
            key={`${item.categoryName}-${item.categoryId}-${item.floor}`}
            dataRef={item}
          >
            {this.renderTreeNodes(item.courseCategoryVOList)}
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
  };

  /**
   * tree option
   */
  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    console.log(selectedKeys,info);
    if (selectedKeys.length > 0) {
      this.setState({ selectedKeys });
      dispatch({
        type:'courseManage/save',
        payload:{
          selectedNodes: info.selectedNodes[0].props.dataRef
        }
      })
    } else {
      this.setState({ selectedKeys: []});
      dispatch({
        type:'courseManage/save',
        payload:{
          selectedNodes: {}
        }
      })
    }
    
  };

  /**
   * button option
   */
  plusCategory = () => {
    const { dispatch } = this.props;
    this.setState({
      modalTitle:'创建课程分类'
    });
    dispatch({
      type:'courseManage/save',
      payload:{
        plusVisible: true,
      }
    })
  };
  editCategory = () => {
    const { dispatch } = this.props;
    this.setState({
      modalTitle:'编辑课程分类'
    });
    if (this.state.selectedKeys.length > 0) {
      dispatch({
        type:'courseManage/save',
        payload:{
          editVisible: true,
        }
      })
    } else {
      message.warning('请先选择操作节点！');
    }
  };
  deleteCategory = () => {
    const { dispatch } = this.props;
    if (this.state.selectedKeys.length > 0) {
      dispatch({
        type:'courseManage/save',
        payload:{
          deleteVisible: true,
        }
      })
    } else {
      message.warning('请先选择操作节点！');
    }
  };

  /**
   * modals option
   */
  handleCreate = value => {
    const { dispatch } = this.props;

    if (this.state.selectedKeys[0]) {
      var parentId = this.state.selectedKeys[0].split('-')[1];
      var floor = this.state.selectedKeys[0].split('-')[2];
    }
    dispatch({
      type: 'courseManage/categorySave',
      payload: {
        categoryName: value.categoryName,
        parentId: parentId || '',
        createStaffId: '0001',
        floor: parseInt(floor) + 1 || 1,
      },
    });
  };

  handleUpdate = value => {
    if (this.state.selectedKeys[0]) {
      var categoryId = this.state.selectedKeys[0].split('-')[1];
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'courseManage/categoryUpdate',
      payload: {
        categoryName: value.categoryName,
        categoryId,
        modifyStaffId: '',
      },
    });
    this.setState({
      selectedKeys:[]
    });
  };
  HandleDelete = () => {
    if (this.state.selectedKeys[0]) {
      var categoryId = this.state.selectedKeys[0].split('-')[1];
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'courseManage/categoryDelete',
      payload: {
        categoryId: categoryId,
      },
    });
    this.setState({
      selectedKeys:[]
    });
  };
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'courseManage/save',
      payload:{
        plusVisible:false,
        deleteVisible: false,
        editVisible:false
      }
    })
  };
  componentWillReceiveProps(nextProps){
    this.setState({
      treeData:nextProps.treeData
    })
  }
  render() {
    const { selectedKeys ,treeData,modalTitle } = this.state;
    const { loading,plusVisible,deleteVisible,editVisible } = this.props;
    let categoryName;

    if (selectedKeys.length > 0) {
      categoryName = selectedKeys[0].split('-')[0];
    }
    return (
      <div>
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
          onExpand={this.onExpand}
          autoExpandParent={this.state.autoExpandParent}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
        <PlusModal
          title={modalTitle}
          visible={plusVisible}
          loading={loading}
          selectedName={categoryName}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

        <EditModal
          visible={editVisible}
          selectedName={categoryName}
          onCancel={this.handleCancel}
          onCreate={this.handleUpdate}
          onChange={this.handlePlusChange}
        />
        <Modal
          title="删除课程分类"
          visible={deleteVisible}
          onOk={this.HandleDelete}
          onCancel={this.handleCancel}
          confirmLoading={loading}
        >
          <p>确定删除{categoryName}分类吗？</p>
        </Modal>
      </div>
    );
  }
}

export default connect((state)=>({...state.courseManage,loading:state.loading.models.courseManage}))(OTree);
