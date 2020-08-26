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
			<!-- 邀请码 -->
			<view class="item flex_between">
				<view class="frame flex_center">
					<input type="text" v-model="inviteCode" :disabled="isInvited" placeholder="请输入邀请码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
				</view>
			</view>
			<!-- 地区 -->
			<view class="item flex_between" @click="show=true">
				<view class="frame flex_center">
					<input type="text" placeholder="请选择您的地区"  v-model="area" :disabled="!area" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
				</view>
				<view class="code fz-14">
					<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<button class="btn item flex_center fz-14" open-type="getAuthorize" scope="userInfo" @getAuthorize="getAliUserInfo" @error="aliAuthRefuse">开启我的链客智慧商圈</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="btn item flex_center fz-14" open-type="getUserInfo" @getuserinfo="getWxUserInfo">开启我的链客通商业联盟</button>
			<!-- #endif -->
			<view class="service fz-12"><text>注册表示您同意以下协议</text><text class="agreement" @click="goService">《服务协议》</text></view>
		</view>
		<!-- 地区选择 -->
		<w-picker
			class="address"
			mode="region" 
			:visible.sync="show" 
			:value="defaultRegion"
			default-type="label"
			@confirm="onConfirm($event,'region')" 
			@cancel="onCancel" 
			ref="region" 
		></w-picker>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				show:false,
				defaultRegion:["北京市","北京市","东城区"], //默认显示
				mobile:'',  //手机号
				code:'', //验证码
				codeText:'',  //验证码文字
				inviteCode:'', //邀请码
				area:'', //所在地区
				provinceCode:'',
				cityCode:'',
				regionCode:'',
				userInfo:{},
				isInvited: false,
				istrue:false,
			}
		},
		computed:{
			isRegist(){
				// 如果有username代表已注册过
				return this.$store.state.userInfo.username;
			},
			scanCode(){
				// 返回聚合码带过来的邀请码
				return this.$store.state.scanCodeQuery;
			}
		},
		watch:{
			isRegist(val){ //如果已注册则直接跳转进入首页
				if(val){
					this.$store.state.userInfo = {};
					uni.reLaunch({
						url:'/pages/index/index'
					})
				}
			},
			scanCode(val){
				if(val){
					this.inviteCode = val;
					this.isInvited = true;
				}
			}
		},
		methods:{
			goService(){  //进入用户协议页面
				uni.navigateTo({
					url: '../../userPages/agreement/index'
				})
			},
			onConfirm($event){ //省市区选择
				console.log($event)
				this.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				let adcode = $event.value[2];
				this.provinceCode = adcode.substring(0,2);
				this.cityCode = adcode.substring(0,4);
				this.regionCode = adcode;
			},
			onCancel(){
				this.show = false;
			},
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
				this.$fly.post('/base/smssend2',{
					account: this.mobile,
					type: 1
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
					}
				})
				.catch(err=>{})
			},
			getAliUserInfo(){ //获取支付宝用户信息
				my.getOpenUserInfo({
					success:res=>{
						this.userInfo = JSON.parse(res.response).response;
						console.log(this.userInfo)
						this.checking();
					},
				})
			},
			aliAuthRefuse(){ // 用户拒绝授权时
				uni.showToast({
					title:'请授权才能完成注册'
				})
			},
			getWxUserInfo($event){ //获取微信用户信息
				if(this.istrue){
					return false
				}
				this.istrue = true;
				
				if($event.detail.userInfo){
					this.userInfo = $event.detail.userInfo;
					this.checking();
				}else{
					this.istrue = false
					uni.showToast({
						title:'请授权才能完成注册'
					})
				}
			},
			checking(){ //检查信息是否填写完整
				const regPhone = /^((1[0-9]{2})+\d{8})$/;
				const regCode = /^[0-9]{6}$/;
				if( !this.mobile || !this.code || !this.inviteCode || !this.provinceCode || !this.cityCode || !this.regionCode){
					uni.showToast({
						title:'请填写完整所有信息'
					})
					this.istrue = false
					return
				}else if(!regPhone.test(this.mobile)){
					uni.showToast({
						title:'手机号格式不正确'
					})
					this.istrue = false
					return
				}else if(!regCode.test(this.code)){
					uni.showToast({
						title:'请输入六位验证码'
					})
					this.istrue = false
					return
				}else{
					this.submit();
				}
			},
			submit(){ //提交
				uni.showLoading({
					title:'加载中',
					mask:true
				})
				// #ifdef MP-ALIPAY
				let params = {
					account: this.mobile,
					addressInfo: this.area,
					areaCode: this.provinceCode,
					areaCodeCity: this.cityCode,
					areaCodeAreas: this.regionCode,
					headUrl: this.userInfo.avatar,
					inviteCode: this.inviteCode,
					nickName: this.userInfo.nickName,
					openId: this.$store.state.userInfo.alipayUserId,
					validationCode: this.code,
					width: 800,
					page: 'pages/login/login',
					aliNickName: this.userInfo.nickName,
					aliAvatar: this.userInfo.avatar,
					gender: this.userInfo.gender == 'm' ? 'MALE' : 'FEMALE',
					registType: 'ALIPAY'
				}
				// #endif
				// #ifdef MP-WEIXIN
				let params = {
					account: this.mobile,
					addressInfo: this.area,
					areaCode: this.provinceCode,
					areaCodeCity: this.cityCode,
					areaCodeAreas: this.regionCode,
					headUrl: this.userInfo.avatarUrl,
					inviteCode: this.inviteCode,
					nickName: this.userInfo.nickName,
					openId: this.$store.state.userInfo.openId,
					validationCode: this.code,
					width: 800,
					page: 'pages/login/login',
					gender: this.userInfo.gender ? (this.userInfo.gender == '1' ? 'MALE' : 'FEMALE') : 'MALE',
					registType: 'WECHAT'
				}
				// #endif
				console.log(params)
				this.$fly.post('/user/register',params)
				.then(res=>{
					console.log(res)
					setTimeout(()=>{
						uni.hideLoading();
					},2000)
					if(res.code == 0){
						// 更新用户信息
						this.$store.state.userInfo = res.data;
						uni.switchTab({
							url:'/pages/index/index'
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
					this.istrue = false
				})
				.catch(err => {
					uni.hideLoading();
					this.istrue = false
				})
			}
		},
		onLoad:function(query){
			// console.log('注册',query)
			// 微信登录
			// #ifdef MP-WEIXIN
			if(query.scene){
				var scene = decodeURIComponent(query.scene).split('=')[1];
			}else{
				var scene = decodeURIComponent(query.q).split('=')[1];
			}
			this.inviteCode = scene;
			if(scene){
				this.isInvited = true;
			}else{
				this.isInvited = false;
			}
			
			// #endif
			// 支付宝登录
			// #ifdef MP-ALIPAY
			// 扫描推广码进来的用户，要显示邀请码，并且禁止修改
			if(this.$store.state.scanCodeQuery || query.code){
				this.inviteCode = this.$store.state.scanCodeQuery || query.code;
				this.isInvited = true;
			}
			// #endif
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
			
			// 获取验证码的时候，用户离开页面要继续倒计时，进来时显示当前倒计时状态
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
</style>
