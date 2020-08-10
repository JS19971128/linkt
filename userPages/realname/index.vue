<template>
	<view class="container">
		<view class="top fz-14">
			<view class="flex_center item">
				<view class="">真实姓名</view>
				<input type="text" v-model="name" placeholder="请输入真实姓名" placeholder-style="font-size:28rpx;line-height:28rpx;color:#BCBCBC"/>
			</view>
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
				name:'',
			}
		},
		methods:{
			submit(){
				if(!this.name){
					uni.showToast({
						title:'请输入真实姓名'
					})
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				let params = {
					realName:this.name,
					userId:this.$store.state.userInfo.id
				}
				this.$fly.post('/user/update',params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						this.$aliLogin();
						setTimeout(()=>{
							uni.switchTab({
								url:'/pages/my/index'
							})
						},1000)
					}else{
						uni.showToast({
							title:res.message
						})
					}
				})
			}
		},
		onLoad:function(){
			this.name = this.$store.state.userInfo.aliRealName || '';
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding-top: 20rpx;
		.item{
			width: 100%;
			height: 50px;
			padding: 0 20rpx;
			box-sizing: border-box;
			background: #fff;
			justify-content: flex-start;
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
