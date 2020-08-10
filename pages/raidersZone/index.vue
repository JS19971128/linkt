<template>
	<view class="raiders_zone">
		<view class="raiders_bg">
			<image src="../../static/images/shop/tu.png" mode=""></image>
			<view class="voucher">
				<view class="left_voucher">
					<view class="frist_uni">0</view>
					<view class="second_uni">夺宝券</view>
				</view>
				<view class="left_voucher right_my">
					<view class="frist_uni">0</view>
					<view class="second_uni">我的充能</view>
				</view>
			</view>
			<view class="treasure" @click="voucherRule=true" >
				夺宝规则
			</view>
		</view>
		<!-- 夺宝规则 -->
		<view class="wrap_flex_bg" v-if="voucherRule">
			<view class="rule_bdi">
				<image class="shut_down" @click="voucherRule=false" src="../../static/images/shop/border_close.png" mode=""></image>
				<view class="rule_title"><text class="middle_text">夺宝规则</text></view>
				<view class="rule_text">
                    在95折以下（不包含95折）的商家消费后，或者购买95折以下（不包含95折）的商品后，会获得夺宝券。夺宝券的面额将以消费金额中的商家折扣计算得出。
				</view>
				<view class="rule_text">
					每张夺宝券有一个专属编号，可单张或多张同时使用，给商品充能。如果该商品能量已充满，将不能继续再对此商品继续充能，可更换其他商品充能。
				</view>
				<view class="rule_text">
					当商品能量充满后，将在会抽取幸运号码，拥有该幸运号码者，将直接获得该商品。
				</view>
			</view>
		</view>
		<!-- 活动商品 -->
	<!-- 	<view class="event_goods">
			<image src="../../static/images/shop/hot.png" mode=""></image>
			<text class="active_text">活动商品</text>
			<image src="../../static/images/shop/hot.png" mode=""></image>
		</view> -->
		<!-- tab切换的列表 -->
		<!-- <goods-list :list="navList"></goods-list> -->
	</view>
</template>

<script>
	import goodsList from '@/my-component/goodsList/index'
	export default{
		data() {
			return {
				//产品数据
				navList:[],
				page:0,//页码
				status:'noMore',//请求切换
				total: 0,
				voucherRule: false
			}
		},
		components:{goodsList},
		onLoad() {
			this.navListFun();
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
		methods: {
			navListFun() {
				this.$fly.get(`/app/mall/list?size=10&page=${this.page}&sortType=sort_time&searchType=draw&sort=createDate,desc`).then(res=>{
					let data = res.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.navList = []
					}
					this.navList = this.navList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.raiders_zone {
		min-height: 100vh;
		background-color: #f2f2f2;
		.raiders_bg {
			height: 104.66vw;
			position: relative;
			image {
				width: 100%;
				height: 100%;
			}
			.treasure {
				position: absolute;
				top: 30rpx;
				right: 20rpx;
				font-size:24rpx;
				font-family:'PingFang SC';
				font-weight:500;
				color:rgba(255,255,255,1);
				border-bottom: 2rpx solid #FFFFFF;
			}
			.voucher {
				position: absolute;
				bottom: 0rpx;
				left: 20rpx;
				width: 710rpx;
				height: 160rpx;
				background: rgba(255,255,255,1);
				box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
				border-radius: 8px;
				padding: 20rpx 0;
				box-sizing: border-box;
				display: flex;
				.left_voucher {
					flex: 1;
					text-align: center;
					.frist_uni {
						font-size:42rpx;
						font-family:'PingFang SC';
						font-weight:800;
						color:rgba(255,132,0,1);
					}
					.second_uni {
						font-size:28rpx;
						font-family:'PingFang SC';
						font-weight:800;
						color:rgba(153,153,153,1);
						margin-top: 30rpx;
					}
				}
				.right_my {
					border-left: 2rpx solid #DCDCDC;
				}
			}
		}
		.wrap_flex_bg {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0,0,0,0.7);
			z-index: 666;
			display: flex;
			justify-content: center;
			align-items: center;
			.rule_bdi {
				width:710rpx;
				height:480rpx;
				background:rgba(255,239,161,1);
				box-shadow:0px 1px 6px 0px rgba(0, 0, 0, 0.2);
				border-radius:8px;
				padding: 60rpx 20rpx 0 20rpx;
				box-sizing: border-box;
				position: relative;
				.shut_down {
					width: 28rpx;
					height: 28rpx;
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}
				.rule_title {
					font-size:32rpx;
					font-family:'PingFang SC';
					font-weight:800;
					color:rgba(255,132,0,1);
					text-align: center;
					margin-bottom: 25rpx;
					.middle_text {
					    position: relative;	
					}
				}
				.rule_text {
					font-size:24rpx;
					font-family:'PingFang SC';
					font-weight:500;
					color:rgba(220,123,20,1);
					line-height: 36rpx;
					text-indent: 2em;
				}
			}
		}
		.event_goods {
			padding: 30rpx;
			text-align: center;
			font-size:28rpx;
			font-family:'PingFang SC';
			font-weight:500;
			color:rgba(51,51,51,1);
			.active_text {
				margin: 0 10rpx;
				vertical-align: middle;
			}
			image {
			    width: 35rpx;
				height: 26rpx;
				vertical-align: middle;
			}
		}
	}
</style>
