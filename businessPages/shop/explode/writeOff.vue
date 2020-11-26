<template>
	<view class="container">
		<view class="main">
			<view class="order_info fz-12">
				<view class="flex_center item">
					<view class="title">收货人</view>
					<view class="content">王大锤</view>
				</view>
				<view class="flex_center item">
					<view class="title">联系电话</view>
					<view class="content">13658596587</view>
				</view>
				<view class="flex_center item">
					<view class="title">收货地址</view>
					<view class="content">广东省深圳市南山区AAA号</view>
				</view>
			</view>
		</view>
		<view class="main" style="margin-top: 20rpx;">
			<view class="order_info fz-12">
				<view class="flex_center item">
					<view class="title">订单号</view>
					<view class="content">2020555885974545</view>
				</view>
			</view>
			<view class="goods">
				<view class="goods-list" v-for="it in details.commodities">
					<image :src="it.picture" mode="aspectFill"></image>
					<view class="info">
						<view class="fz-14">{{it.name}}</view>
						<view class="fz-12">{{it.commoditySpecName}} x{{it.count}}</view>
						<view class="fz-12">￥{{it.salePrice}}</view>
					</view>
				</view>
			</view>
			<view class="order_info fz-12">
				<view class="flex_center item">
					<view class="title">订单金额</view>
					<view class="content">{{100||0}}</view>
				</view>
				<view class="flex_center item">
					<view class="title">支付时间</view>
					<view class="content">2020-05-26 15:15:15</view>
				</view>
			</view>
		</view>
		
		<view class="main" style="margin-top: 20rpx;">
			<view class="order_info fz-12">
				<view class="flex_center item jube">
					<view class="title">核销数量</view>
					<view class="content"><stepper :number="buyNumber" @update="update"></stepper></view>
				</view>
			</view>
		</view>
		<!-- 确认核销 -->
		<view class="pop_wrap" v-if="show">
			<view class="pop_content">
				<view class="close flex_center" @click="show=false">
					<image src="../../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="pop-title">确认核销</view>
					<view class="pop-item">
						<view class="pop-list">
							<view class="pop-list-title">订单号:</view>
							<view class="pop-list-txt">LKT55558855522555</view>
						</view>
						<view class="pop-list">
							<view class="pop-list-title">商品名称:</view>
							<view class="pop-list-txt">洗剪吹最超飘逸假发洗剪吹最超飘逸假发</view>
						</view>
						<view class="pop-list">
							<view class="pop-list-title">核销数量:</view>
							<view class="pop-list-txt">1 份</view>
						</view>
					</view>
					<view class="pop-btns">
						<view class="fz-14 pop_wrap-btn flex_center" @click="show=false">关闭</view>
						<view class="fz-14 pop_wrap-btn flex_center color" @click="goSuccess">赠送</view>	
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn fz-14 flex_center rz" @click="goStm">确认核销</view>
	</view>
</template>

<script>
	import stepper from '@/my-component/stepper/index'
	export default {
		components:{stepper},
		data() {
			return {
				details: {},
				buyNumber:1,
				show:false
			}
		},
		methods:{
			//核销数量
			update(e){
				console.log(e)
				this.buyNumber = e.num;
			},
			goStm(){
				this.show = true;
				console.log(this.buyNumber)
			},
			//弹出框提交
			goSuccess(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 20rpx;

		.main {
			width: 710rpx;
			background: #fff;
			border-radius: 8rpx;
			margin: 0 auto;
			padding: 0 30rpx;
			box-sizing: border-box;

			.user_info {
				flex-direction: column;
				padding: 50rpx 0;
				line-height: 44rpx;
				border-bottom: 2rpx dashed #DBDBDB;

				image {
					width: 100rpx;
				}
			}

			.order_info {
				padding-top: 20rpx;
				padding-bottom: 30rpx;

				.item {
					margin-top: 30rpx;

					.title {
						width: 25%;
						color: #999999;
					}
					&.jube{
						justify-content: space-between;
						.content{
							width: auto;
						}
					}
					.content {
						width: 75%;
						color: #333;
						justify-content: flex-start;

						.location {
							margin-right: 10rpx;

							image {
								width: 28rpx;
								display: block;
							}
						}

						.phone {
							margin-right: 10rpx;

							image {
								width: 28rpx;
								display: block;
							}
						}
					}
				}
			}
		}
	}
	
	.pop_content{
		width: 590rpx;
		padding: 0 30rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-top: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			.pop-title{
				font-size: 38rpx;
				text-align: center;
				margin-bottom: 20rpx;
			}
			.pop-item{
				.pop-list{
					display: flex;
					align-items: center;
					.pop-list-title{
						width: 160rpx;
						text-align: right;
						color: #b7b7b7;
						margin-right: 10rpx;

					}
					.pop-list-txt{
						color: #282828;
						flex: 1;
					}
				}
			}
			.pop-btns{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.pop_wrap-btn{
					width: 240rpx;
					height: 74rpx;
					background: #fff;
					border-radius: 15rpx;
					color: #282828;
					margin: 50rpx 0;
					border: 1px solid #aaa;
					&.color{
						background: #FF9D29;
						border-color: #FF9D29;
						color: #fff;
					}
				}
			}
			
		}
	}
	
	.goods-list {
		display: flex;
		border-bottom: 1px solid #eee;
		padding: 10rpx 0 20rpx;
		image {
			width: 50px;
			height: 50px;
			display: block;
			border-radius: 8rpx;
		}
	
		.info {
			margin-left: 20rpx;
			line-height: 36rpx;
	
			.fz-12 {
				color: #999999;
			}
		}
	}
	
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		border: 2rpx solid #FF9D11;
		color: #FF9D11;
		background: #fff;
		position: fixed;
		bottom: 30rpx;
		left: 40rpx;
		&.rz{
			background: #FF9D11;
			color: #fff;
		}
		&.nrz{
			background: #DDDDDD;
			border: 2rpx solid #DDDDDD;
			color: #fff;
		}
	}
	
</style>

