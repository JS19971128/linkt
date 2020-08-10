<template>
	<view class="container">
		<view class="top fz-14">
			<view class="flex_center item">
				<view class="">手机号码</view>
				<input type="text" v-model="mobile" placeholder="请输入手机号码" placeholder-style="font-size:28rpx;line-height:28rpx;color:#BCBCBC"/>
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
			<view class="">因支付宝收益的功能需要使用到您的真实姓名，所以请务必填写真实的姓名，否则将会导致您收益出现缺失的情况。</view>
			<view class="">如果因执意使用虚假名字而导致收益缺失，平台将不承担相关责任。</view>
		</view>
		<view class="btn flex_center fz-14" @click="submit">保存</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				mobile:'',  //手机号
				code:'', //验证码
				codeText:'',  //验证码文字
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
			submit(){
				
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
