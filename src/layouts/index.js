import styles from './index.css';
import { Layout } from 'antd';
import OHeader from '@/components/header';
import OMinHeader from '@/components/minHeader';
import OLoginHeader from '@/components/loginHeader';
import OFooter from '@/components/footer';
import OMinLoginHeader from '@/components/minLoginHeader';
const { Header, Content } = Layout;

const setMinHeaderPage = new Set([
  '/course/coursePlay'
  ]);

function BasicLayout(props) {
  let Nav,content,header;
  let styleLayout = styles.noraml;

  content = styles['other-content'];
  header = styles['min-header'];

  if (props.location.pathname === '/login'){
    Nav = OLoginHeader;
    styleLayout = styles["login-noraml"];
    content = styles['login-content'];
    header = styles['login-header'];
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



  return (
    <Layout className={styleLayout}>
      <Header className={header}>
        <Nav/>
      </Header>
      <Content className={content}>{props.children}</Content>
      <OFooter></OFooter>
    </Layout>
  );
}

export default BasicLayout;
