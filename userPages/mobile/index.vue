<template>
	<view class="container">
		<view class="top fz-14">
			<view class="flex_center item">
				<view class="">手机号码</view>
				<input type="text" v-model="mobile" placeholder="请输入真实有效的手机号" placeholder-style="font-size:28rpx;line-height:28rpx;color:#BCBCBC"/>
			</view>
		</view>
		<view class="top fz-14">
			<view class="flex_center item">
				<view class="">验证码</view>
				<input type="number" pattern="[0-9]*" v-model="code" placeholder="请输入验证码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
			</view>
			<view class="code fz-14" @click="gainCode">{{codeText}}</view>
		</view>
		<view class="notice fz-14">
			<view class="">同步手机号后，可以同步保存您的优惠券与夺宝券数量，为您的消费保障权益喔~</view>
		</view>
		<!-- <button class="btn item flex_center fz-14" open-type="getUserInfo" @getuserinfo="getWxUserInfo">开启我的链客智慧商圈</button> -->
		<view class="btn flex_center fz-14" @click="checking">保存</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				mobile:'',  //手机号
				code:'', //验证码
				codeText:'',  //验证码文字
				timer:true,
				userInfo:{}
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
					}
				})
				.catch(err=>{})
			},
			getWxUserInfo($event){ //获取微信用户信息
				if($event.detail.userInfo){
					this.userInfo = $event.detail.userInfo;
					this.checking();
				}else{
					uni.showToast({
						title:'请授权才能完成同步'
					})
				}
			},
			async checking(){
				if(!this.timer){
					setTimeout(()=>{
						this.timer = true
					},3000)
				}
				this.timer = false
				try{
					const regPhone = /^((1[0-9]{2})+\d{8})$/;
					if(!regPhone.test(this.mobile)){
						uni.showToast({
							title:'手机号格式不正确'
						})
						return
					}
					let params = {
					  "account": this.mobile,
					  "loginType": 0,
					  "openId": this.$store.state.userInfo.openId,
					  "validationCode": Number(this.code)
					}
					uni.showLoading({
						title:'加载中'
					})
					let userBindPhone = await this.$fly.post('/user/userBindPhone',params)
					uni.hideLoading();
					if(userBindPhone.code!=0){
						uni.showToast({
						    title: userBindPhone.message,
							icon:'none',
						    duration: 2000
						});
						return false;
					}
					this.$store.commit('SETUSERINFO',userBindPhone.data)
					uni.switchTab({
						url:'/pages/index/index'
					})
				}catch(e){
					uni.showToast({
					    title: '同步手机号码失败！',
						icon:'none',
					    duration: 2000
					});
				}finally{
					uni.hideLoading();
				}
				
				
				
			}
		},
		onLoad:function(){
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
				this.mobile = this.$store.state.userInfo.username || '';
				this.codeText = '获取验证码';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		background: #fff;
		.item{
			width: 100%;
			height: 50px;
			box-sizing: border-box;
			justify-content: flex-start;
			flex: 1;
			>view{
				width: 20%;
				color: #9A9A9A;
			}
			input{
				width: 70%;
				font-size: 28rpx;
				line-height: 28rpx;
				padding: 0;
				color: #333;
			}
		}
		.code{
			color: #999;
			line-height: 28rpx;
		}
	}
	.notice{
		color: #9A9A9A;
		padding: 30rpx 20rpx;
		line-height: 30rpx;
		>view{
			margin-bottom: 30rpx;
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		background: #FF9E12;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 18px;
	}
</style>
