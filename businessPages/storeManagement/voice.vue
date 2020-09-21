<template>
	<view class="container">
		<view class="top fz-14">
			<view class="flex_center item">
				<view class="">设备编码</view>
				<input type="text" v-model="deviceName" placeholder="请输入设备编码" placeholder-style="font-size:28rpx;line-height:28rpx;color:#BCBCBC"/>
			</view>
		</view>
		<view class="notice fz-14">
			<view class="">绑定语音音箱成功后，即可通过音箱直接播报收款哦~</view>
			<view class="">如有需要可以联系客服咨询，客服电话：4000871349</view>
		</view>
		<!-- <button class="btn item flex_center fz-14" open-type="getUserInfo" @getuserinfo="getWxUserInfo">开启我的链客智慧商圈</button> -->
		<view class="btn flex_center fz-14" @click="checking">{{isNew?'绑定设备':'更换设备'}}</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				isNew:false,
				deviceName:'',
				ls:'',
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods:{
			checking(){
				if(this.ls){
					this.device(2,this.ls);
				}
				this.device(1,this.deviceName);
			},
			async device(type,deviceName){
				try{
					let {userInfo} = this;
					let {uid,username} = userInfo;
					let params = {
						deviceName,
						type,
						uid,
						phone:username
					}
					uni.showLoading({
						title:'加载中'
					})
					let deviceBind = await this.$fly.get('/device/bind',params);
					if(type!==2){
						uni.showToast({
						    title: deviceBind.message,
							icon:'none',
						    duration: 2000
						});
					}
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '更改失败！',
						icon:'none',
					    duration: 2000
					});
					console.error(e)
				}
			}
		},
		onLoad:function(o){
			if(o.deviceName){
				this.deviceName = o.deviceName;
				this.ls = o.deviceName;
				this.isNew = false;
			}else{
				this.deviceName = '';
				this.isNew = true;
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
		border-bottom: 1px solid #eee;

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
