import style from './index.css';
import { Card, Divider, Icon, Col, Row } from 'antd';
import Link from 'umi/link';

export default function(props) {
  return (
    <div className={style.box}>
      <Card
        title={
          <div>
            <Divider type="vertical" className={style.divider} />
            最近学习课程
          </div>
        }
        bordered={false}
        extra={
          <Link to="/www.baidu.com">
            更多课程
            <Icon type="right" />
          </Link>
        }
        className={style.card}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
        </Row>
      </Card>
      <Card
        title={
          <div>
            <Divider type="vertical" className={style.divider} />
            最新课程
          </div>
        }
        bordered={false}
        extra={
          <Link to="/www.baidu.com">
            更多课程
            <Icon type="right" />
          </Link>
        }
        className={style.card}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5d5377660922e54c12000676-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5d5377660922e54c12000676-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5d5377660922e54c12000676-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5d5377660922e54c12000676-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
        </Row>
      </Card>
      <Card
        title={
          <div>
            <Divider type="vertical" className={style.divider} />
            热门课程
          </div>
        }
        bordered={false}
        extra={
          <Link to="/www.baidu.com">
            更多课程
            <Icon type="right" />
          </Link>
        }
        className={style.card}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="example"
                  src="//img1.mukewang.com/szimg/5da13cab09466e9105400306-360-202.png"
                />
              }
            >
              <Card.Meta title="初一语文学习课程" description="www.instagram.com" />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
