import styles from './index.css';
import { Layout } from 'antd';
import OHeader from '@/components/header';
import OMinHeader from '@/components/minHeader';
import OLoginHeader from '@/components/loginHeader';
import OMinLoginHeader from '@/components/minLoginHeader';
const { Header, Content } = Layout;

const setMinHeaderPage = new Set([
  '/course/coursePlay'
  ]);

function BasicLayout(props) {
  let Nav,content,header;

  content = styles['other-content'];

  if (props.location.pathname === '/login'){
    Nav = OLoginHeader;
  }else {
    if (setMinHeaderPage.has(props.location.pathname) == true){
      Nav = OMinHeader;
    } else {
      Nav = OHeader;
    }
  }

    /*if(props.location.pathname === '/'){
    Nav = OHeader;
  }else if(props.location.pathname === '/course' || props.location.pathname === '/course/coursePlay'){
    Nav = OMinHeader;
  }else{
    Nav = OMinLoginHeader;
  }*/

  header = styles['min-header'];

  return (
    <Layout className={styles.noraml}>
      <Header className={header}>
        <Nav/>
      </Header>
      <Content className={content}>{props.children}</Content>
    </Layout>
  );
}

export default BasicLayout;
