<template>
	<view v-show="ifShow">
		<view class="main">
			<view class="top fz-14 flex_between">
				<view class="top-item">总营业额/元</view>
				<view class="flex_center top-item total">
					<view>98485743.54</view>
					<uni-icons class="flex_center" type="arrowright" color="#FF9834"></uni-icons>
				</view>
			</view>
			<view class="list">
				<view class="item flex_between">
					<view class="info flex_center">
						<image class="merchant_pic" src="../../../static/images/my/avatar.png" mode="widthFix"></image>
						<view class="">
							<view class="fz-14">麻辣小龙虾前海分店</view>
							<view class="fz-12">13658547856</view>
						</view>
					</view>
					<view class="fz-12">待审核</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="createStore">新建分店</view>
	</view>
</template>

<script>
	export default{
		name:'chainStore',
		props:["show"],
		data() {
			return {
				
			}
		},
		computed:{
			ifShow(){
				return this.show;
			}
		},
		methods:{
			createStore(){
				uni.navigateTo({
					url:'/businessPages/createChainStore/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		width: 710rpx;
		margin: 0 auto;
		.top{
			width: 100%;
			height: 120rpx;
			background: url(../../../static/images/business/bg.png) no-repeat;
			background-size: 100% 100%;
			color: #fff;
			.top-item{
				padding: 0 30rpx;
			}
			.total{
				color: #FF9834;
			}
		}
		.list{
			padding-bottom: 166rpx;
			.item{
				padding: 20rpx;
				line-height: 40rpx;
				background: #fff;
				border-radius: 8rpx;
				box-shadow: 0 0 20rpx 2rpx rgba(0,0,0,.1);
				margin-top: 20rpx;
				.merchant_pic{
					width: 90rpx;
					height: 90rpx;
					display: block;
					margin-right: 20rpx;
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9E12;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 46rpx;
	}
</style>
