<template>
	<view class="bg">
		<view class="logo flex_center">
			<image src="../../static/images/common/logo.png" mode="widthFix"></image>
		</view>
		<view class="main">
			<!-- 手机号 -->
			<view class="item flex_between">
				<view class="frame flex_center">
					<input type="number" pattern="[0-9]*" v-model="mobile" placeholder="请输入您的手机号码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
				</view>
			</view>
			<!-- 验证码 -->
			<view class="item flex_between">
				<view class="frame flex_center">
					<input type="number" pattern="[0-9]*" v-model="code" placeholder="请输入验证码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
				</view>
				<view class="code fz-14" @click="gainCode">{{codeText}}</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="btn item flex_center fz-14" @click="getWxUserInfo">登录</button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button class="btn item flex_center fz-14" @click="getWxUserInfo">登录</button>
			<!-- #endif -->
			<view class="zhuce" @click="clickUrl">立即注册</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				codeText:'',
				isTrue:false
			}
		},
		computed:{
			isRegist(){
				// 如果有username代表已注册过
				return this.$store.state.userInfo.username;
			}
		},
		watch:{
			isRegist(val){ //如果已注册则直接跳转进入首页
				if(val){
					this.$store.state.userInfo = {};
					uni.switchTab({
						url:'/pages/index/index'
					})
				}
			}
		},
		methods:{
			gainCode(){ //获取验证码
				if(this.codeText !== '获取验证码'){
					return
				}
				const regPhone = /^((1[0-9]{2})+\d{8})$/;
				if(!regPhone.test(this.mobile)){
					uni.showToast({
						title:'请输入正确的手机号码'
					})
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.post('/base/smssend2',{
					account: this.mobile,
					type: 4
				})
				.then(res=>{
					if(res.code == 0){
						uni.showToast({
							title: '验证码已发送'
						})
						this.$util.timer(60, (t) => {
							if (t) {
								this.codeText = t + '秒后重获';
								this.$store.state.regMobile = this.mobile;
							} else {
								this.codeText = '获取验证码';
							}
						})
						uni.hideLoading();
					}else{
						uni.showToast({
							title:res.message
						})
						uni.hideLoading();
					}
				})
				.catch(err=>{
					uni.hideLoading();
					uni.showToast({
						title:`获取验证码失败${err}`
					})
				})
			},
			clickUrl(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			getWxUserInfo(){ //获取微信用户信息
				if(this.isTrue){
					setTimeout(()=>{this.isTrue = false},2000)
					return
				}
				this.isTrue = true;
				let openId = this.$store.state.userInfo.openId;
				let {mobile,code} = this;
				if(!mobile){
					uni.showToast({
						title:'请输入手机号码',
						duration: 2000
					})
					return;
				}
				if(!code){
					uni.showToast({
						title:'请输入验证码',
						duration: 2000
					})
					return;
				}
				uni.showLoading({
					title:'加载中'
				})
				
				//#ifdef MP-ALIPAY
					let data = {
						account:mobile,
						openId,
						validationCode:code,
						loginType : 1
					}
				//#endif
				
				//#ifdef MP-WEIXIN
					let data = {
						account:mobile,
						openId,
						validationCode:code,
						loginType : 0
					}
				//#endif
				this.$fly.post('/user/userLogin',data)
				.then(res=>{
					uni.hideLoading();
					uni.showToast({
						title:res.message,
						duration: 2000
					})
					
					if(res.code == 0){
						this.$store.state.userInfo = res.data;
						uni.switchTab({
							url:'/pages/index/index'
						})
					}
					
				})
				.catch(err=>{
					console.log(err)
					uni.showToast({
						title:'网络错误，请稍后重试',
						duration: 2000,
						icon:'none'
					})
				})
			},
		},
		onLoad:function(query){
		},
		onShow:function(){
			// #ifdef MP-WEIXIN
			if(!this.$store.state.userInfo.uid){
				// 如果是扫码进来的未登录则登录获取openId
				this.$wxLogin();
			}
			// #endif
			// 支付宝登录
			// #ifdef MP-ALIPAY
			// 扫描推广码进来的用户，要显示邀请码，并且禁止修改
			if(!this.$store.state.userInfo.uid){
				// 如果是扫码进来的未登录则登录获取alipayUserId
				this.$aliLogin();
			}
			// #endif
			if(this.$store.state.countDownTime){
				this.$util.timer(this.$store.state.countDownTime, (t) => {
					if (t) {
						this.codeText = t + '秒后重获';
						this.mobile = this.$store.state.regMobile;
					} else {
						this.codeText = '获取验证码';
					}
				})
			}else{
				this.codeText = '获取验证码';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		height: 100vh;
		background: #F0EEEC;
		.logo{
			padding-top: 100rpx;
			padding-bottom: 30rpx;
			image{
				width: 250rpx;
				display: block;
			}
		}
		.main{
			width: 670rpx;
			margin: 0 auto;
			.item{
				height: 38px;
				padding: 0 50rpx;
				border-radius: 19px;
				background: #fff;
				margin-top: 20px;
				.frame{
					width: 60%;
					justify-content: flex-start;
					input{
						width: 90%;
						font-size: 14px;
						line-height: 14px;
						padding: 0;
					}
				}
				.code{
					color: #999;
					line-height: 28rpx;
					image{
						width: 24rpx;
						display: block;
					}
				}
			}
			.btn{
				background: #FF9D29;
				color: #fff;
			}
			.service{
				line-height: 24rpx;
				text-align: center;
				margin-top: 30rpx;
				color: #999999;
				.agreement{
					color: #50A9E6;
				}
			}
		}
	}
	.zhuce{
		width: 100%;
		display: flex;
		justify-content: center;
		color: #298EFF;
		margin-top: 20rpx;
		
	}
</style>
