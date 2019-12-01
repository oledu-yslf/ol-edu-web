import { connect } from 'dva';
import { Card, Divider,Col, Row ,Pagination,Empty} from 'antd';
import OSearchBar from './components/OSearchBar'
import router from 'umi/router';



import styles from './index.less';

const pageSize = 20;

// import ReactPlayer from 'react-player';
function course(props) {
  const { list,total,dispatch,loading} = props;
  const searchCourse = value => {
    console.log(value);
    dispatch({
      type: 'course/save',
      payload: {
        ...value,
      },
    });
    dispatch({
      type: 'course/courseListpage',
      payload: {
        ...value,
        // categoryId:selectedNodes.categoryId || '',
        page: {
          pageSize,
          pageNum: 1,
        },
      },
    });
  };
  const pageChange = (page, pageSize) => {
    dispatch({
      type: 'course/save',
      payload: {
        pageNum: page,
      },
    });
    dispatch({
      type: 'course/courseListpage',
      payload: {
        page: {
          pageSize,
          pageNum: page,
        },
      },
    });
  }
  const handleClick = (item,e)=>{
    console.log(item);
    router.push({
      pathname:'/course/coursePlay',
      query:{
        courseId:item.courseId
      }
    })
  }
  const List = ()=>{
    return list.map((item)=>{
      return (
        <Col span={6}
        key={item.courseId}
        onClick={(e)=>handleClick(item,e)}
        style={{marginBottom:'20px'}}>
          {
            item.logoFile?
            <Card
            hoverable
            cover={
              <img
                style={{width:'100%',height:'160px'}}
                alt="logo"
                src={`/api/${item.logoFile.url}/${item.logoFile.fileName}`}
              />
            }
          >
            <Card.Meta title={item.courseName}/>
          </Card>:
          <Card
          hoverable
          cover={
            <img
              style={{width:'100%',height:'160px'}}
              alt="logo"
              src='//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png'
            />
          }
        >
          <Card.Meta title={item.courseName}/>
        </Card>
          }
        </Col>
      )
    })
  }
  if (!loading && total === 0) {
    return (
      <div className={styles.box}>
        <OSearchBar onSearch={searchCourse} />
        <Divider />
        <Empty />
      </div>
    );
  }
  return (
    <div className={styles.box}>
      <OSearchBar onSearch={searchCourse} />
      <Divider />
      <Row gutter={16}>
        <List/>
      </Row>
      {/* <ReactPlayer
        url="api/fileserver/video/20191108/8086cefbb32147f897c33099c2ffa0a3/8086cefbb32147f897c33099c2ffa0a3.m3u8"
        playing
      /> */}
      <Pagination defaultCurrent={1} total={total} pageSize={pageSize} onChange={pageChange} />
    </div>
  );
}
export default connect((state)=>({...state.course,loading:state.loading.models.course}))(course);
