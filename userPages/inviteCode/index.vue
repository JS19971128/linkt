<template>
	<view class="bg">
		<view class="invite_bg">
			<view class="top flex_center">
				<view class="fz-14">您的邀请码</view>
				<view class="fz-24">{{qrcode}}</view>
				<view class="fz-12 copy flex_center" @click="copy">复制</view>
			</view>
			<view class="bottom flex_center">
				<view class="qrcode">
					<image :src="codeUrl" mode="aspectFit"></image>
				</view>
				<view class="tip fz-12">
					<view>截图后分享给其他人扫一扫</view>
					<view>注册后即可成为您的好友</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				
			}
		},
		computed:{
			qrcode(){
				return this.$store.state.userInfo.inviteCode;
			},
			codeUrl(){
				let userInfo = this.$store.state.userInfo;
				// #ifdef MP-ALIPAY
				return userInfo.unionCodeUrl || userInfo.alipayCodeUrl;
				// #endif
				//#ifdef MP-WEIXIN
				return userInfo.unionCodeUrl || userInfo.codeUrl;
				// #endif
			}
		},
		methods:{
			copy(){
				uni.setClipboardData({
					data:this.qrcode,
					success: res => {
						// #ifdef MP-ALIPAY
						uni.showToast({
							title:'复制成功！'
						})
						// #endif
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		height: 100vh;
		padding-top: 20rpx;
		box-sizing: border-box;
		background: url('../../static/images/my/bg2.png') no-repeat;
		background-size: 100% 100%;
		.invite_bg{
			width: 710rpx;
			height: 435px;
			background: url(../../static/images/my/bg3.png) no-repeat;
			background-size: 100% 100%;
			margin: 0 auto;
			.top{
				width: 630rpx;
				height: 168px;
				margin: 0 auto;
				border-bottom: 2rpx dashed #E3E3E3;
				padding: 60rpx 0;
				box-sizing: border-box;
				flex-direction: column;
				justify-content: space-between;
				text-align: center;
				.fz-14{
					color: #333;
					line-height: 28rpx;
				}
				.fz-24{
					color: #FF9D12;
					line-height: 48rpx;
					font-weight: bold;
				}
				.copy{
					width: 140rpx;
					height: 40rpx;
					border-radius: 20rpx;
					border: 2rpx solid #FF9D11;
					color: #FF9D12;
					line-height: 24rpx;
				}
			}
			.bottom{
				height: 266px;
				padding: 30px;
				box-sizing: border-box;
				flex-direction: column;
				justify-content: space-between;
				text-align: center;
				.qrcode{
					image{
						width: 170px;
						height: 170px;
						display: block;
					}
				}
				.tip{
					color: #999;
					line-height: 40rpx;
				}
			}
		}
	}
</style>
