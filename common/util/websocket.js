import fly from '@/API/index'
import store from '@/store/index'
let ws,wsUrl = '';
let token;
let timeSend;
let send;

const init = async (data) =>{
	if(!data.isOpenVoice){ //设置不进行语音播报的弹出
		return ;
	}
	token = await fly.get('https://openapi.baidu.com/oauth/2.0/token',{
		grant_type:'client_credentials',
		client_id:store.state.baiduKey,
		client_secret:store.state.baiduSecret
	});
	
	wsUrl = store.state.webSocket+'/ws?userId='+data.id;
	
	//判断是否已经存在有连接  有就关闭
	
	if(ws){
		console.log('已经存在连接')
		return
	}
	
	ws = uni.connectSocket({
		// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
		url: wsUrl,
		success(data) {
			console.log("websocket连接成功");
		},
	});
	
	ws.onClose((data)=>{
		clearInterval(timeSend);
		console.log(data)
	})
	ws.onError((data)=>{
		console.log(data)
	})
	
	ws.onMessage((data)=>{
	   console.log('接收到消息');
	   let title = JSON.parse(data.data);
	   console.log(title);
		if(title.title){
			const innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.src = encodeURI(`https://tsn.baidu.com/text2audio?tex=${title.title}&tok=${token.access_token}&cuid=${token.access_token}&ctp=1&lan=zh`);
			console.log(innerAudioContext)
			innerAudioContext.play()
			innerAudioContext.onPlay(() => {
			  console.log('开始播放');
			});
			innerAudioContext.onError((res) => {
			  console.log(res.errMsg);
			  console.log(res.errCode);
			});
		}
		 
	});
	
	ws.onOpen(()=>{
		console.log('连接成功')
		//判断是否有定时器 有就关闭
		timeSend && clearInterval(timeSend);
		timeSend = setInterval(()=>{
			ws.send({data:'心跳内容'})
		},10000)
	})
	
	
	
	
	
}

module.exports = {
  init
}