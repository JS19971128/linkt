<template>
	<view class="goods" v-if="type==='block'">
		<view class="goods-item">
			<view class="goods-list" v-for="item in leftList" @click="goCommodity(item.id)" :key="item.id">
				<image class="goods-list-img" :src="item.listUrl"></image>
				<view class="goods-list-detail">
					<view class="title">{{item.commodityName}}</view>
					<view class="rebate">
						<view class="rebate-title">{{item.isSelfManage?'直营':'商家'}}</view>
						可折扣{{item.profits || 0}}%
					</view>
					<view class="dit">
						<view class="price">
							<view class="price-f">￥</view>
							{{item.priceSale}}
						</view>
						<view class="txt">
							已售 {{item.saleSum}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-item">
			<view class="goods-list" v-for="item in rightList" @click="goCommodity(item.id)" :key="item.id">
				<image class="goods-list-img" :src="item.listUrl"></image>
				<view class="goods-list-detail">
					<view class="title">{{item.commodityName}}</view>
					<view class="rebate">
						<view class="rebate-title">{{item.isSelfManage?'直营':'商家'}}</view>
						可折扣{{item.profits || 0}}%
					</view>
					<view class="dit">
						<view class="price">
							<view class="price-f">￥</view>
							{{item.priceSale}}
						</view>
						<view class="txt">
							已售 {{item.saleSum}}
						</view>
					</view>
				</view>
			</view>	
		</view>
	</view>
	<view class="column" v-else>
		<view class="column-item">
			<view class="column-item-list" v-for="(item,index) in list" @click="goCommodity(item.id)" :key="item.id">
				<view class="column-item-list-imgs">
					<image class="column-item-list-imgs-img" :src="item.listUrl"></image>
					<view class="column-item-list-imgs-title" v-if="item.isDraw">消费夺宝</view>
				</view>
				<view class="column-item-list-detail">
					<view class="detail-title">{{item.commodityName}}</view>
					<view class="detail-active">
						<view class="detail-active-class">{{item.isSelfManage?'直营':'商家'}}</view>
						<view class="detail-active-coupon">优惠券可折扣{{item.profits || 0}}%</view>
					</view>
					<view class="detail-info">
						<view class="info-price">
							<text class="info-price-f">￥</text>{{item.priceSale}}
						</view>
						<view class="info-sale">已售 {{item.saleSum}}</view>
					</view>
					<view class="detail-shop">
						<view class="shop-title">
							<view class="shop-title-name">{{item.merchantName}}</view>
							<view class="shop-enter" @click.stop="jumpShop(item.merchantId)" v-if="!shop">
								进店
								<image src="../../static/images/common/more_gray.png" class="shop-right"></image>
							</view>
						</view>
						<image src="../../static/images/shop/cartlist.png" class="shop-img" @click.stop="clickSpecs(item.id)"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品购买选择规格 -->
		<goods-specs :goods="goods" @onGoBtn="onGoBtn" ref="goods"></goods-specs>
		<!-- 商品购买选择规格 -->
	</view>
</template>

<script>
	import goodsSpecs from '@/my-component/goodsSpecs/index'
	export default{
		name:'goosdList',
		data() {
			return {
				leftList:[],
				rightList:[],
				goods:{},
				commodityId:''
			}
		},
		components: {
			goodsSpecs
		},
		props:{	
			list:{
				type:Array,
				default:()=>[]
			},
			type:{
				type:String,
				default:'block'
			},
			shop:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			newList(){
				let leftList = []
				let	rightList = [];
				let list = this.list;
				for(let i in list){
					if(i%2){
						rightList.push(list[i]);
					}else{
						leftList.push(list[i]);
					}
				}
				this.leftList = leftList;
				this.rightList = rightList;
			},
			isSpecs(){
				return this.$store.state.isSpecs;
			},
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			}
		},
		methods:{
			//购买产品确认
			onGoBtn(e) {
				let specId = e.specification.id
				if(!specId) return wx.showToast({
				  title: '请选择商品规格',
				  icon: 'none',
				  duration: 2500
				})
				let commoditySum = e.buyNumber;
				let {goods,commodityId,userId} = this;
				let param = {
					specId,
					userId,
					commoditySum,
					commodityId,
					merchantId:goods.merchantId
				}
				
				uni.showLoading({
					title:'加载中'
				})
				
				this.$fly.post(`/app/cart/add`,param).then(res => {
					uni.hideLoading();
					wx.showToast({
					  title: res.message,
					  icon: 'none',
					  duration: 2500
					})
					if(res.code!=0){
						return
					};
					this.$store.commit('SETISSPECS',false);
				})
				
				
			},
			//跳转店铺页
			jumpShop(id){
				uni.navigateTo({
					url:`/shoppingPages/shop/index?merchantId=${id}`
				})
			},
			//跳转商品详情页
			goCommodity(id){
				let str = `?id=${id}`;
				if(this.shop){
					str+=`&shop=${this.shop}`
				}
				uni.navigateTo({
					url:`/shoppingPages/commodity/index${str}`
				})
			},
			//获取商品详情
			goodsDetails(id) {
				this.$fly.get(`/web/commodity/${id}`).then(res => {
					let {
						data
					} = res;
					this.goods = data;
					this.$nextTick(()=>{
						this.$store.commit('SETISSPECS',true);
						this.$refs.goods.Init();
					})
				})
			},
			//打开选择规格
			clickSpecs(id){
				this.commodityId = id;
				this.goodsDetails(id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods{
		margin-left: 20rpx;
		display: flex;
		margin-top: 20rpx;
		&-item{
			width: 345rpx;
			margin-right: 19rpx;
		}
		&-list{
			width:100%;
			background: #fff;
			margin-bottom:20rpx;
			border-radius: 8rpx;
			&-img{
				width: 100%;
				height:345rpx;
				border-radius: 8rpx 8rpx 0 0;
			}
			&-detail{
				padding: 13rpx 15rpx 15rpx;
				.title{
					font-size: 26rpx;
					color: #000;
					line-height: 1.3;
					margin-bottom: 20rpx;
					overflow : hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.dit{
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					line-height: 1;
					.price{
						color: #ff9f12;
						line-height: 1;
						font-size: 30rpx;
						margin-top: 14rpx;
						display: flex;
						align-items: flex-end;
						&-f{
							line-height: 1.5;
							font-size: 18rpx;
						}
					}
					.txt{
						font-size: 20rpx;
						color: #999999;
					}
				}
				.rebate{
					font-size:18rpx;
					border:2rpx solid rgba(255,152,52,1);
					height: 24rpx;
					display: flex;
					align-items: center;
					color: rgba(255,152,52,1);
					width: 145rpx;
					border-radius: 4rpx;
					line-height: 1;
					&-title{
						background:rgba(255,152,52,1);
						color: #fff;
						width: 40rpx;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 5rpx;
					}
				}
			}
			&:nth-child(2n){
				margin-right: 0;
			}
		}
	}
	.column{
		display: flex;
		flex-direction: column;
		&-item{
			padding-left: 20rpx;
			&-list{
				display: flex;
				width: 100%;
				box-sizing: border-box;
				box-shadow:0px 1rpx 0px 0px rgba(222,222,222,1);
				padding-right: 20rpx;
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				&-imgs{
					position: relative;
					width: 240rpx;
					height: 240rpx;
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
				&-detail{
					flex: 1;
					margin-left: 20rpx;
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
						display: flex;
						align-items: center;
						margin-top: 20rpx;
						&-class{
							color: #fff;
							font-size: 18rpx;
							background:rgba(255,152,52,1);
							border-radius:4px;
							padding: 3rpx 5rpx;
							line-height: 1.2;
						}
						&-coupon{
							font-size:24rpx;
							color:#FE4545;
							line-height:1;
							flex: 1;
							margin-left: 20rpx;
						}
					}
					.detail-info{
						display: flex;
						align-items: flex-end;
						margin-top: 20rpx;
						line-height: 1;
						.info-price{
							font-size: 38rpx;
							color: #FF9834;
							&-f{
								font-size: 18rpx;
							}
						}
						.info-sale{
							color: #999999;
							font-size: 24rpx;
							margin-left: 20rpx;
						}
					}
					.detail-shop{
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						margin-top: 20rpx;
						.shop-title{
							color: #999999;
							font-size: 24rpx;
							display: flex;
							align-items: center;
							.shop-title-name{
								overflow : hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								flex: 1;
								max-width: 250rpx;
							}
							.shop-enter{
								margin-left: 20rpx;
								.shop-right{
									margin-left: 10rpx;
									width: 9rpx;
									height: 14rpx;
								}
							}
						}
						.shop-img{
							width: 46rpx;
							height: 46rpx;
						}
					}
				}
			}
		}
	}
</style>
