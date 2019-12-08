import React from 'react';
import style from './index.less';
import { Card, Divider, Icon, List } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

class Index extends React.Component {
  handleClick = (item, e) => {
    window.open(`/course/coursePlay?courseId=${item.courseId}`);
  };

  render() {
    const { recentList, newList, hotList, loading } = this.props;
    const ListHeader = props => {
      const { type } = props;
      return (
        <div className="clearfix">
          <div className={style.pullleft}>
            <Divider type="vertical" className={style.divider} />
            {type === 1 ? '最近学习课程' : type === 2 ? '最新课程' : '热门课程'}
          </div>
          <Link to="/course" className={style.pullright}>
            更多课程
            <Icon type="right" />
          </Link>
        </div>
      );
    };
    return (
      <div className={style.box}>
        {localStorage.getItem('jwToken') && !loading ? (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={recentList}
            header={<ListHeader type={1} />}
            renderItem={item => (
              <List.Item>
                <Card
                  style={{ marginTop: '20px' }}
                  hoverable
                  onClick={e => this.handleClick(item, e)}
                  cover={
                    <img
                      style={{ width: '100%', height: '160px' }}
                      alt="logo"
                      src={`/api/${item.logoFile.url}/${item.logoFile.fileName}`}
                    />
                  }
                >
                  <Card.Meta title={item.courseName} />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}

        {!loading ? (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={newList}
            header={<ListHeader type={2} />}
            renderItem={item => (
              <List.Item>
                <Card
                  style={{ marginTop: '20px' }}
                  hoverable
                  onClick={e => this.handleClick(item, e)}
                  cover={
                    <img
                      style={{ width: '100%', height: '160px' }}
                      alt="logo"
                      src={`/api/${item.logoFile.url}/${item.logoFile.fileName}`}
                    />
                  }
                >
                  <Card.Meta title={item.courseName} />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
        {!loading ? (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={hotList}
            header={<ListHeader type={3} />}
            renderItem={item => (
              <List.Item>
                <Card
                  style={{ marginTop: '20px' }}
                  hoverable
                  onClick={e => this.handleClick(item, e)}
                  cover={
                    <img
                      style={{ width: '100%', height: '160px' }}
                      alt="logo"
                      src={`/api/${item.logoFile.url}/${item.logoFile.fileName}`}
                    />
                  }
                >
                  <Card.Meta title={item.courseName} />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default connect(state => ({ ...state.index, loading: state.loading.models.index }))(Index);
