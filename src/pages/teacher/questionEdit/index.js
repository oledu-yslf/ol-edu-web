import { connect } from 'dva';
import styles from './index.less';
function App({questionEdit,dispatch}) {
    const { text,list } = questionEdit;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({questionEdit})=>({questionEdit}))(App);
