import Fly from 'flyio/dist/npm/wx';
import store from '../store';

const fly = new Fly();

// fly.config.baseURL='https://v.liankedl.com/api';
fly.config.baseURL = store.state.baseUrl;
// fly.config.baseURL='http://192.168.3.196:8566'; //shuguang
// fly.config.baseURL='http://192.168.3.148:8888'; //liangrongcai
// fly.config.baseURL='http://192.168.3.150:8566'; //xianwen

// 请求拦截
fly.interceptors.request.use(request => {
    // let token = store.state.token;
    // if (token) {
    //     request.headers['Authorization'] = `Bearer ${token}`;
    // }
    return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        return response.data
    },
    (err) => {
        //发生网络错误后会走到这里
        //return Promise.resolve("ssss")
    }
)

export default fly;