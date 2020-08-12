import fly from '@/API/index'
import store from '@/store/index'
let ws,wsUrl = '';
let token;



const init = async (data) =>{
	if(!data.isOpenVoice){ //设置不进行语音播报的弹出
		return ;
	}
	token = await fly.get('https://openapi.baidu.com/oauth/2.0/token',{
		grant_type:'client_credentials',
		client_id:store.state.baiduKey,
		client_secret:store.state.baiduSecret
	});
	
	wsUrl = store.state.webSocket+'/ws?userId='+data.id
	ws = uni.connectSocket({
		// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
		url: wsUrl,
		success(data) {
			console.log("websocket连接成功");
		},
	});
	const innerAudioContext = uni.createInnerAudioContext();
	
	ws.onMessage((data)=>{
	   console.log('接收到消息');
	   let title = JSON.parse(data.data);	
			   debugger
		if(title.title){
			innerAudioContext.autoplay = true;
			innerAudioContext.src = `http://tsn.baidu.com/text2audio?tex=${title.title}&tok=${token.access_token}&cuid=${token.access_token}&ctp=1&lan=zh`;
			innerAudioContext.onPlay(() => {
			  console.log('开始播放');
			});
		}
		 
	});
	
	let send = (res)=>{
		ws.send({
			data:res
		})
	}
	
	setInterval(()=>{
		send('心跳内容');
	},30000)
}


var lockReconnect = false;//避免重复连接
const reconnect = (url)=>{
      if(lockReconnect) {
        return;
      };
      lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      tt && clearTimeout(tt);
      tt = setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
      }, 4000);
}

var heartCheck = {
      timeout: 3000, //每隔三秒发送心跳
      num: 3,  //3次心跳均未响应重连
      timeoutObj: null,
      serverTimeoutObj: null,
      start: function(){
        var _this = this;
        var _num = this.num;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              ws.send("123456789"); // 心跳包
              _num--;
              //计算答复的超时次数
              if(_num === 0) {
                   ws.colse();
              }
        }, this.timeout)
      }
}

module.exports = {
  init
}