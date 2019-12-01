// import { connect } from 'dva';
import { Card, Button, Switch, Row, Col } from 'antd';
import moment from 'moment'
import styles from './index.css';

const { Meta } = Card;
function OCell(props) {
  const {
    courseName:optionCourseName,
    courseId:optionCourseId,
    totalChapter,
    totalPeriod,
    isPutaway,
    teacherStaffId,
    modifyDate,
    createDate,
    handleDelete,
    handleEdit,
    logoFile,
  } = props;
  let date = modifyDate?new Date(modifyDate):new Date(createDate) 
  const handleEditClick = ()=>{
    handleEdit(optionCourseId)
  }
  const handleDeleteClick = ()=>{
    handleDelete(optionCourseName,optionCourseId)
  }
  return (
    <div>
      <Row className={styles['margin-20']} gutter={24} justify={'space-between'} align={'bottom'}>
        <Col span={8}>
          <Card
            hoverable
            cover={
              logoFile?<img alt="" src={`/api${logoFile.url}/${logoFile.fileName}`} style={{width:'280px',height:'160px'}}/>
              :<img alt="" src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"  style={{width:'280px',height:'160px'}}/>
            }
          >
            <Meta title={optionCourseName} />
          </Card>
        </Col>
        <Col span={13}>
          <div className={styles['cell-center']}>
            <p>章节数量:{totalChapter}</p>
            <p>课时数量:{totalPeriod}</p>
            <p>是否上架:{isPutaway ? '上架' : '下架'}</p>
            <p>讲师:{teacherStaffId}</p>
            <p>修改时间:{moment(date).format('YYYY-MM-DD') || '-'}</p>
          </div>
        </Col>
        <Col span={3}>
          <div>
            <Button type="primary" onClick={handleEditClick}>
              编辑
            </Button>
          </div>
          
          <div style={{marginTop:'20px',marginBottom:'20px'}}>
            <Button type="danger" onClick={handleDeleteClick}>
              删除
            </Button>
          </div>
          <div>
            <Switch checkedChildren="上架" unCheckedChildren="下架" defaultChecked />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default OCell;
