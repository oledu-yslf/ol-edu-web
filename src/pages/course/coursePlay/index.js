import { connect } from 'dva';
import styles from './index.less';
import ReactPlayer from 'react-player';
import router from 'umi/router';
import Link from 'umi/link';
import { Tree, Row, Col } from 'antd';
// import Bread from './components/Bread'

const checkToken = url => {
  const jwToken = JSON.parse(localStorage.getItem('jwToken'));
  let token = `${jwToken.token_type} ${jwToken.access_token}`;
  return token;
};
const { TreeNode } = Tree;

function coursePlay(props) {
  const { courseDetail } = props;
  const { chapterVOList } = courseDetail;
  const renderTreeNodes = data => {
    if (data) {
      return data.map(item => {
        if (item.periodVOList) {
          return (
            <TreeNode title={item.chapterName} key={item.chapterId} dataRef={item}>
              {renderTreeNodes(item.periodVOList)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={periodsTitleNode(item)}
            key={`${item.chapterId}-${item.periodId}`}
            dataRef={item}
            isLeaf={true}
          />
        );
      });
    }
    return <TreeNode />;
  };

  const periodsTitleNode = item => {
    console.log(item);
    return (
      <Row>
        <Col span={4}>
          <Link
            to={`/course/coursePlay?courseId=${item.courseId}&chapterId=${item.chapterId}&periodId=${item.periodId}`}
          >
            {item.periodName}
          </Link>
        </Col>
        <Col offset={16} span={4}>
          {item.attachFileInfo ? (
            <div>
              <span>{item.attachFileInfo.fileName}</span>
            </div>
          ) : (
            ''
          )}
        </Col>
      </Row>
    );
  };

  return (
    <div className={styles.box}>
      {/* <Bread/> */}

      <ReactPlayer
        // ref={this.ref}
        width="960px"
        height="540px"
        style={{ margin: '20px auto' }}
        url="/api/fileserver/video/20191120/c632b414b3cf48899f73d32e11eed760/c632b414b3cf48899f73d32e11eed760.m3u8"
        playing
        config={{
          file: {
            hlsOptions: {
              forceHLS: true,
              debug: false,
              xhrSetup: function(xhr, url) {
                xhr.setRequestHeader('Authorization', checkToken());
              },
            },
          },
        }}
      />
      <Tree
        // checkable
        // onExpand={this.onExpand}
        // expandedKeys={this.state.expandedKeys}
        // autoExpandParent={this.state.autoExpandParent}
        // onCheck={this.onCheck}
        // checkedKeys={this.state.checkedKeys}
        // onSelect={this.onSelect}
        // selectedKeys={this.state.selectedKeys}
        showLine
      >
        {renderTreeNodes(chapterVOList)}
      </Tree>
    </div>
  );
}
export default connect(state => ({
  ...state.coursePlay,
  loading: state.loading.models.coursePlay,
}))(coursePlay);
