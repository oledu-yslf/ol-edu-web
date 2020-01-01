import { connect } from 'dva';
import styles from './index.less';
function App({paperList,dispatch}) {
    const { text,list } = paperList;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({paperList})=>({paperList}))(App);
