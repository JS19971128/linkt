<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 所属行业 -->
			<view class="item flex_center">
				<view class="item-name">所属行业</view>
				<view class="item-content">{{form.shopBusinessName}}</view>
			</view>
			<!-- 让利比率 -->
			<view class="item flex_center">
				<view class="item-name">让利比率</view>
				<view class="item-content">{{form.profits||0}}%</view>
			</view>
			<!-- 店铺地址 -->
			<view class="item flex_center">
				<view class="item-name">店铺地址</view>
				<view class="item-content">{{form.area}}</view>
			</view>
			<!-- 详细地址 -->
			<view class="item flex_center">
				<view class="item-name">详细地址</view>
				<view class="item-content">{{form.address}}</view>
			</view>
			<!-- 营业时间 -->
			<view class="item flex_center">
				<view class="item-name">营业时间</view>
				<view class="item-content">{{form.shopStartTime}}-{{form.shopStopTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'bankInfo',
		props:["show"],
		data() {
			return {
				form:{}
			}
		},
		computed:{
			ifShow(){
				return this.show;
			}
		},
		methods:{
			init(form){
				this.form = form	
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		line-height: 28rpx;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 30rpx 20rpx;
				// height: 100rpx;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 20%;
				}
				.item-content{
					justify-content: flex-start;
					color: #333;
					width: 80%;
					.frame{
						width: 90%;
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
					}
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
