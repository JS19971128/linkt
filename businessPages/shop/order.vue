<template>
	<view class="shop">
		<view class="shop-item">
			<view class="shop-item-list" :class="{'active':i===shopTitleIndex}" v-for="(item,i) in shopTitle" @click="clickq(i)">
				{{item.title}}
			</view>
		</view>
		<view class="shop-order">
			<view class="shop-order-item" v-for="(item,i) in navList" :key="item.orderNo" @click="goDetails(item.orderNo)">
				<view class="item-address flex_between">
					<view class="address">
						<view class="address-title">
							<view class="title-name">订单号</view>
							<view class="title-mobile">{{item.orderNo}}</view>
						</view>
						<view class="address-title">
							<view class="title-name">{{item.consigneeName}}</view>
							<view class="title-mobile">{{item.consigneePhone}}</view>
						</view>
						<view class="address-detail">{{item.addrInfo}}</view>
					</view>
					<view class="item-status flex_center">{{item.orderStatus | orderStatus}}</view>
				</view>
				<view class="item-goods">
					<view class="goods-list flex_center" v-for="(goods,index) in item.commodities" :key="goods.id">
						<view class="goods-list-imgs">
							<image class="goods-list-imgs-img" :src="goods.picture"></image>
						</view>
						<view class="goods-list-detail">
							<view class="detail-head">
								<view class="detail-title">{{goods.name}}</view>
								<view class="detail-active flex_between">
									<view class="detail-active-coupon">{{goods.commoditySpecName}}</view>
									<view class="detail-active-status">x{{goods.count}}</view>
								</view>
							</view>
							<view class="detail-info">
								<view class="detail-info-txt">{{item.createDate}}</view>
								<view class="detail-info-price">
									<text class="detail-info-price-f">￥</text>{{goods.salePrice}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="item-total">
					<view class="total-price total-right">总价 ￥{{item.priceTotal}}</view>
					<view class="total-discount total-right">优惠 ￥{{item.sharedCoupons}}</view>
					<view class="total-payment total-right">实付 ￥{{item.pricePaid}}</view>
				</view>
				<view class="item-btns" v-if="item.orderStatus=='Paid' || item.orderStatus=='Shipped'">
					<view class="btn flex_center block" @click.stop="deliverGoods(item)" v-if="item.orderStatus=='Paid'">发货</view>
					<view class="btn flex_center" v-else>已发货</view>
				</view>
			</view>
		</view>
		<!-- 弹出框 -->
		<view class="popup" v-if="popup">
			<view class="pop_content">
				<view class="close flex_center" @click="popup=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="box-item flex_center">
						<view class="item-address">
							<view class="address-list">
								<view class="address-label">收货人</view>
								<view class="address-txt">{{orderMack.consigneeName}}</view>
							</view>
							<view class="address-list">
								<view class="address-label">联系电话</view>
								<view class="address-txt">{{orderMack.consigneePhone}}</view>
							</view>
							<view class="address-list">
								<view class="address-label">收货地址</view>
								<view class="address-txt">{{orderMack.addrInfo}}</view>
							</view>
						</view>
						<view class="item-input">
							<input type="text" placeholder="请输入物流公司" @input="inputChane($event,'expressCompany')" class="item-input-input" />
							<input type="number" placeholder="请输入快递单号" @input="inputChane($event,'expressNo')" class="item-input-input" />
						</view>
						<view class="item-goods-item">
							<view class="item-goods" v-for="(item,index) in orderMack.commodities" :key="item.id">
								<image :src="item.picture" class="item-goods-img"></image>
								<view class="item-goods-detail">
									<view class="detail-title">{{item.name}}</view>
									<view class="detail-price"><text class="detail-price-f">￥</text>{{item.salePrice}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="fz-14 btn flex_center" @click="addStock(orderMack.orderNo)">发货</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shopList from '@/my-component/goodsList/shopGoods'
	export default{
		data(){
			return{
				page:0,
				navList:[],
				shopTitle:[{title:'全部',key:""},{title:'待付款',key:"Pending"},{title:'待发货',key:"Paid"},{title:'已发货',key:"Shipped"}],
				shopTitleIndex:0,
				status:'',
				popup:false,
				expressCompany:'',
				expressNo:'',
				orderStatust:'',
				orderMack:{}
			}
		},
		components:{shopList},
		computed:{
			merchantId(){ //商家id
				return this.$store.state.goods.merchantId || 200;
			},
		},
		methods:{
			async addStock(orderNo){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let {expressCompany,expressNo} = this;
					let data = {
						expressRemark:'',
						expressCompany,expressNo
					};
					let delivery = await this.$fly.post(`/app/order/${orderNo}/delivery`,data);
					if(delivery.code!=0){
						uni.showToast({
						    title: delivery.message,
						    duration: 2000
						});
						return false;
					}
					this.page = 0;
					this.popup = false;
					this.init();
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '发货失败！',
					    duration: 2000
					});
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			},
			inputChane(e,name){
				this[name] = e.detail.value;
			},
			// 发货
			deliverGoods(res){
				this.orderMack = res;
				this.popup = true;
			},
			//切换
			clickq(i){
				this.shopTitleIndex = i;
				this.orderStatust = this.shopTitle[i].key;
				this.page = 0;
				this.init()
			},
			init(){
				this.navListFun()
			},
			async navListFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let param = {
						merchantId:this.merchantId,
						status:this.orderStatust
					};
					let orderList = await this.$fly.get('/app/order/list',param);
					if(orderList.code!=0){
						uni.showToast({
						    title: orderList.message,
						    duration: 2000
						});
						return false;
					}
					let data = orderList.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.navList = []
					}
					data.content.forEach(item=>{
						item.createDate = this.$util.formatTime(item.createDate,'yyyy-MM-dd');
					})
					this.navList = this.navList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '拉取订单失败！',
					    duration: 2000
					});
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			},
			goDetails(orderNo) { //进入订单详情页面
				uni.navigateTo({
					url: `/userPages/orderDetails/index?orderNo=${orderNo}&isShop=true`
				})
				
			
			}
		},
		filters:{
			orderStatus(status){
				let obj = {
					Pending:'未付款',
					Paid:'已付款',
					Shipped:'已发货',
					NoCommented:'未评论',
					Finished:'已完成',
					Canceled:'已取消'
				}
				return obj[status];
			}
		},
		onShow() {
			
		},
		onLoad(res) {
			this.clickq(Number(res.index)||0)
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
	}
</script>

<style lang="scss" scoped>
	.shop{
		width: 100%;
		min-height: 100vh;
		background: #efefef;
		padding-top: 20rpx;
		&-item {
			box-sizing: border-box;
			width: 100%;
			margin: 20rpx 0;
			padding:0 20rpx 15rpx;
			display: flex;
			&-list {
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				line-height: 1;
				flex: 1;
				color: #999999;
				&.active{
					color: #FF9834;
					position: relative;
					&::after{
						display: block;
						content: '';
						color: #FF9733;
						width: 20rpx;
						height: 10rpx;
						background: url(../../static/images/home/tab_icon.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: -15rpx;
					}
				}
			}
		}
		.shop-order{
			padding: 0 20rpx;
			font-size: 24rpx;
			line-height: 1;
			.shop-order-item{
				width: 710rpx;
				background:rgba(255,255,255,1);
				border-radius:8rpx;
				flex-direction: column;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				.item-address{
					padding: 20rpx 0;
					box-shadow:0px 1px 0px 0px rgba(222,222,222,1);
					width: 100%;
					box-sizing: border-box;
					.address{
						padding-left: 20rpx;
						display: flex;
						flex-direction: column;
						font-size: 26rpx;
						color: #999999;
						.address-title{
							display: flex;
							margin-bottom: 15rpx;
							.title-name{
								font-size: 28rpx;
								color: #333333;
								margin-right: 20rpx;
							}
						}
						.address-detail{
							flex: 1;
							line-height: 1.3;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
					}
					.item-status{
						width: 140rpx;
						box-shadow:-1px 0px 0px 0px rgba(222,222,222,1);
						height: 112rpx;
						margin-left: 15rpx;
					}
				}
				.item-goods{
					display: flex;
					flex-direction: column;
					padding: 0rpx 20rpx 20rpx 20rpx;
					width: 100%;
					box-sizing: border-box;
					.goods-list{
						box-shadow:0px 1px 0px 0px rgba(222,222,222,1);
						padding-bottom: 20rpx;
						padding-top: 20rpx;
						.goods-list-imgs{
							position: relative;
							width: 180rpx;
							height: 180rpx;
							&-img{
								width: 100%;
								height: 100%;
								border-radius: 8rpx;
							}
							&-title{
								position: absolute;
								top: 0;
								left: 0;
								width:88rpx;
								height:33rpx;
								background:rgba(255,41,41,1);
								font-size: 18rpx;
								color: #fff;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 8rpx 0 8rpx 0;
							}
						}
						.goods-list-detail{
							flex: 1;
							margin-left: 20rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.detail-head{
								.detail-title{
									font-size:28rpx;
									color:#000;
									line-height:38rpx;
									overflow : hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 2;
									-webkit-box-orient: vertical;
								}
								.detail-active{
									margin-top: 20rpx;
									&-coupon{
										font-size:26rpx;
										color:#FE4545;
										line-height:1;
										flex: 1;
									}
									&-status{
										font-size: 28rpx;
									}
								}
							}
							.detail-info{
								display: flex;
								align-items: flex-end;
								margin-top: 20rpx;
								line-height: 1;
								justify-content: space-between;
								.detail-info-price{
									font-size: 38rpx;
									color: #FF9834;
									&-f{
										font-size: 18rpx;
									}
								}
							}
						}
					}
				}
				.item-total{
					display: flex;
					justify-content: flex-end;
					color: #999999;
					box-shadow:0px 1px 0px 0px rgba(222,222,222,1);
					padding:0 20rpx 20rpx 20rpx;
					.total-right{
						margin-left: 30rpx;
					}
					.total-payment{
						color: #333333;
					}
				}
				.item-btns{
					width: 100%;
					padding: 20rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: flex-end;
					.btn{
						width:138rpx;
						height:46rpx;
						background:rgba(255,255,255,1);
						border:2rpx solid rgba(153, 153, 153, 1);
						border-radius:30rpx;
						color: #999999;
						line-height: 1;
						font-size: 24rpx;
						&.block{
							color: #333;
							border-color: #333;
						}
					}
				}
			}
		}
	}
	
	
	.popup{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.4);
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
			.box-item{
				// padding: 20rpx;
				width: 100%;
				box-sizing: border-box;
				flex-direction: column;
				.item-address{
					display: flex;
					flex-direction: column;
					border-bottom: 1rpx #AAAAAA solid;
					width: 100%;
					.address-list{
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 20rpx;
						font-size: 24rpx;
						line-height: 1.2;
						.address-label{
							width: 100rpx;
							color: #AAAAAA;
						}
						.address-txt{
							flex: 1;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
					}
				}
				.item-input{
					display: flex;
					flex-direction: column;
					border-bottom: 1rpx #AAAAAA solid;
					margin-top: 20rpx;
					width: 100%;
					.item-input-input{
						margin-bottom: 20rpx;
						width: 100%;
						border:solid 1rpx #D3D3D3;
						padding-left: 5rpx;
						line-height: 40rpx;
						height: 40rpx;
						font-size: 24rpx;
					}
					
				}
				.item-goods-item{
					display: flex;
					flex-direction: column;
					width: 100%;
					margin-top: 20rpx;
				}
				.item-goods{
					width: 100%;
					display: flex;
					align-items: center;
					border-bottom:1px solid #aaa ;
					padding-bottom: 20rpx;
					box-sizing: border-box;
					&-img{
						width: 140rpx;
						height: 140rpx;
						margin-right: 20rpx;
					}
					&-detail{
						display: flex;
						flex-direction: column;
						flex: 1;
						.detail-title{
							font-size: 28rpx;
							line-height: 38rpx;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.detail-price{
							font-size: 38rpx;
							color: #FF9834;
							&-f{
								font-size: 18rpx;
							}
						}
					}
				}
			}
			.btn{
				width: 100%;
				height: 74rpx;
				background: #FF9D29;
				border-radius: 37rpx;
				color: #fff;
				margin: 50rpx 0;
			}
		}
	}
</style>
