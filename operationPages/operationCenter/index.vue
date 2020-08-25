<template>
	<view class="container">
		<view class="top flex_center">
			<view class="user_info flex_center">
				<view>
					<image class="avatar" :src="operator.headImg || '../../static/images/my/avatar.png'" mode="widthFix" />
				</view>
				<view class="nickname">
					<view class="level flex_center">
						<view class="fz-14">{{operator.nickName}}</view>
						<view class="fz-12">{{operator.title || '总裁'}}</view>
					</view>
					<view class="fz-12">{{operator.addressInfo}}</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="bar fz-14">
				<!-- 区域商家 -->
				<view class="item flex_between" @click="goWhere('/operationPages/areaBusiness/index')">
					<view class="title flex_center">
						<image src="../../static/images/operation/area_merchant.png" mode="widthFix"></image>
						<text>区域商家</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 区域拓展员 -->
				<view class="item flex_between" @click="goWhere('/operationPages/areaExpand/index')">
					<view class="title flex_center">
						<image src="../../static/images/operation/developer.png" mode="widthFix"></image>
						<text>区域拓展员</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 运营人员 -->
				<view class="item flex_between" v-if="operator.type!=='OPERATOR'" @click="goWhere('/operationPages/operator/index')">
					<view class="title flex_center">
						<image src="../../static/images/operation/yy_icon03.png" mode="widthFix"></image>
						<text>运营人员</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 运营中心协议 -->
				<view class="item flex_between" @click="goWhere('/operationPages/agreement/index')">
					<view class="title flex_center">
						<image src="../../static/images/my/service.png" mode="widthFix"></image>
						<text>运营中心协议</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="bar fz-14">
				<!-- 进件商家 -->
				<!-- <view class="item flex_between" @click="goWhere('/operationPages/entryBusiness/index')">
					<view class="title flex_center">
						<image src="../../static/images/operation/yy_icon04.png" mode="widthFix"></image>
						<text>进件商家</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view> -->
				<!-- 电子授权牌 -->
				<!-- <view class="item flex_between" @click="goWhere('/operationPages/authorize/index')">
					<view class="title flex_center">
						<image src="../../static/images/operation/yy_icon05.png" mode="widthFix"></image>
						<text>电子授权牌</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view> -->
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
			operator(){ //运营人员信息
				return this.$store.state.operatorData;
			}
		},
		methods:{
			goWhere(url){ //进入相应页面
				uni.navigateTo({
					url
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		height: 100px;
		background: url('../../static/images/my/bg.png') no-repeat;
		background-size: 100% 100%;
		.user_info{
			width: 90%;
			height: 60px;
			justify-content: flex-start;
			.avatar{
				width: 60px;
				height: 60px;
				border-radius: 50%;
			}
			.nickname{
				margin-left: 20rpx;
				color: white;
				line-height: 50rpx;
				.level{
					justify-content: flex-start;
					.fz-12{
						color: #fff;
						padding: 4rpx 10rpx;
						border: 2rpx solid #fff;
						border-radius: 4rpx;
						line-height: 24rpx;
						transform: scale(0.9);
						margin-left: 10rpx;
					}
				}
				.copy{
					margin-left: 10rpx;
					width: 70rpx;
					height: 32rpx;
					border: 2rpx solid #fff;
					border-radius: 16rpx;
				}
			}
		}
	}
	.main{
		color: #333333;
		.bar{
			margin-top: 20rpx;
		}
		.item{
			padding: 0 30rpx;
			height: 100rpx;
			background: white;
			border-bottom: 2rpx solid #D3D3D3;
			.title{
				image{
					width: 48rpx;
					display: block;
				}
				text{
					margin-left: 20rpx;
				}
			}
			.more{
				image{
					width: 24rpx;
					display: block;
				}
			}
		}
	}
</style>
