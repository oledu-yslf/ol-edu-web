import styles from './index.css';
import { Layout } from 'antd';
import OHeader from '@/components/header';
import OMinHeader from '@/components/minHeader';
import OLoginHeader from '@/components/loginHeader';
import OMinLoginHeader from '@/components/minLoginHeader';
const { Header, Content } = Layout;

function BasicLayout(props) {
  let Nav,content,header;
  if (props.location.pathname === '/login'){
    content = styles['login-content'];
  }else if(props.location.pathname === '/'){
    content = styles['content'];
  }else{
    content = styles['other-content'];
  }

  if (props.location.pathname === '/login'){
    Nav = OLoginHeader;
  }else if(props.location.pathname === '/'){
    Nav = OHeader;
  }else if(props.location.pathname === '/course' || props.location.pathname === '/course/coursePlay'){
    Nav = OMinHeader;
  }else{
    Nav = OMinLoginHeader;
  }

  if (props.location.pathname === '/login' || props.location.pathname === '/'){
    header = styles.header;
  }else{
    header = styles['min-header'];
  }
  return (
    <Layout className={styles.noraml}>
      <Header className={header}>
        <Nav/>
      </Header>
      <Content className={content}>{props.children}</Content>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
}

export default BasicLayout;
