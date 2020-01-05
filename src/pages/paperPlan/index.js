import { connect } from 'dva';
import styles from './index.less';
function App({paperPlan,dispatch}) {
    const { text,list } = paperPlan;
    return (
        <div className={styles.normal}>
            <h2>
                {text}
            </h2>
        </div>
    );
}
export default connect(({paperPlan})=>({paperPlan}))(App);
