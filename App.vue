<script>
export default {
	methods:{
				
	},
	onLaunch: function(options) {
		console.log('App Launch');
		// 获取二维码参数
		if(options.query && options.query.qrCode){
			let qrCode = options.query.qrCode.split('&')[0].split('=')[1];
			this.$store.state.scanCodeQuery = qrCode;
		}
		
		const updateManager = uni.getUpdateManager();
		
		updateManager.onCheckForUpdate(function (res) {
		  // 请求完新版本信息的回调
		  console.log(res.hasUpdate);
		});
		
		updateManager.onUpdateReady(function (res) {
		  uni.showModal({
		    title: '更新提示',
		    content: '新版本已经准备好，是否重启应用？',
		    success(res) {
		      if (res.confirm) {
		        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
		        updateManager.applyUpdate();
		      }
		    }
		  });
		
		});
		
		updateManager.onUpdateFailed(function (res) {
		  // 新的版本下载失败
		  uni.showModal({
		    title: '提示',
		    content: '检查到有新版本，但下载失败，请检查网络设置!!',
		    success(res) {

		    }
		  });
		});
		
	},
	onShow: function(options) {
		console.log('App Show');
		// 获取二维码参数
		if(options.query && options.query.qrCode){
			let qrCode = options.query.qrCode.split('&')[0].split('=')[1];
			this.$store.state.scanCodeQuery = qrCode;
		}
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
@import './common/common.css';
page{
	height: 100%;
}
</style>
