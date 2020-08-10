<template>
	<view class="shop">
		<view class="shop-info">
			<view class="shop-info-title">商城数据</view>
			<view class="shop-info-item">
				<view class="shop-info-item-list" @click="clickOrder(0)">
					<view class="shop-info-item-list-num">{{shopCount.totalCount}}</view>
					<view class="shop-info-item-list-txt">总订单数</view>
				</view>
				<view class="shop-info-item-list">
					<view class="shop-info-item-list-num">{{shopCount.todayCount}}</view>
					<view class="shop-info-item-list-txt">今日订单数</view>
				</view>
				<view class="shop-info-item-list">
					<view class="shop-info-item-list-num">{{shopCount.yesterdayCount}}</view>
					<view class="shop-info-item-list-txt">昨日订单数</view>
				</view>
			</view>
			<view class="shop-info-item">
				<view class="shop-info-item-list" @click="clickOrder(1)">
					<view class="shop-info-item-list-num">{{shopCount.pendingCount}}</view>
					<view class="shop-info-item-list-txt">待付款</view>
				</view>
				<view class="shop-info-item-list" @click="clickOrder(2)">
					<view class="shop-info-item-list-num">{{shopCount.paidCount}}</view>
					<view class="shop-info-item-list-txt">待发货</view>
				</view>
				<view class="shop-info-item-list" @click="clickOrder(3)">
					<view class="shop-info-item-list-num">{{shopCount.shippedCount}}</view>
					<view class="shop-info-item-list-txt">已发货</view>
				</view>
			</view>
			<view class="shop-info-item">
				<view class="shop-info-item-list" @click="clickGoodsManage(0)">
					<view class="shop-info-item-list-num">{{shopStatus.onSale}}</view>
					<view class="shop-info-item-list-txt">在售</view>
				</view>
				<view class="shop-info-item-list" @click="clickGoodsManage(1)">
					<view class="shop-info-item-list-num">{{shopStatus.inStock}}</view>
					<view class="shop-info-item-list-txt">仓库中</view>
				</view>
				<view class="shop-info-item-list" @click="clickGoodsManage(2)">
					<view class="shop-info-item-list-num">{{shopStatus.soldOut}}</view>
					<view class="shop-info-item-list-txt">售完</view>
				</view>
			</view>
		</view>
		<view class="shop-label">
			<view class="shop-label-title">我的工具</view>
			<view class="shop-label-item">
				<view class="shop-label-list" @click="onClickUrl('/businessPages/shop/goodsManage')">
					<view class="shop-label-list-icon">
						<image class="shop-label-list-icon-img" src="../../static/images/shop/goods.png"></image>
					</view>
					<view class="shop-label-list-txt">商品管理</view>
				</view>
				<view class="shop-label-list" @click="onClickUrl('/businessPages/shop/releaseGoods/index')">
					<view class="shop-label-list-icon">
						<image class="shop-label-list-icon-img" src="../../static/images/shop/releasegoods.png"></image>
					</view>
					<view class="shop-label-list-txt">发布商品</view>
				</view>
				<view class="shop-label-list" @click="onClickUrl('/businessPages/shop/order')">
					<view class="shop-label-list-icon">
						<image class="shop-label-list-icon-img" src="../../static/images/shop/order.png"></image>
					</view>
					<view class="shop-label-list-txt">商城订单</view>
				</view>
				<view class="shop-label-list">
					<view class="shop-label-list-icon">
						<image class="shop-label-list-icon-img" src="../../static/images/shop/pj.png"></image>
					</view>
					<view class="shop-label-list-txt">评价管理</view>
				</view>
			</view>
		</view>
		<view class="shop-goods-title">已售完</view>
		<view class="shop-goods">
			<shop-list :list='navList' @goodsAdd="goodsAdd"></shop-list>
		</view>
		<popup :goods="goods"></popup>
	</view>
</template>

<script>
	import shopList from '@/my-component/goodsList/shopGoods'
	import popup from '@/my-component/popup/index'
	export default{
		data(){
			return{
				page:0,
				navList:[],
				goods:{},
				shopStatus:{
					onSale:0,
					inStock:0,
					soldOut:0
				},
				shopCount:{}
			}
		},
		components:{shopList,popup},
		computed:{
			merchantId(){ //商家id
				return this.$store.state.goods.merchantId || '';
			},
		},
		methods:{
			clickGoodsManage(index){
				uni.navigateTo({
					url:`/businessPages/shop/goodsManage?index=${index}`
				})
			},
			clickOrder(index){
				uni.navigateTo({
					url:`/businessPages/shop/order?index=${index}`
				})
			},
			init(){
				this.navListFun()
				this.stockStatusCountFun()
				this.shopCountFun()
			},
			// 查询商品库存状态分类对应数量
			async stockStatusCountFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let {merchantId,shopStatus} = this;
					let stockStatusCount = await this.$fly.get('/web/commodity/stockStatusCount',{merchantId});
					let stockStatus = stockStatusCount.data;
					
					for(let i of stockStatus){
						shopStatus[i.stockStatusName] = i.count
					}
					
					this.shopStatus = shopStatus;
				}catch(e){
					uni.showToast({
					    title: '拉取商品数量失败！',
					    duration: 2000
					});
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			},
			async shopCountFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					
					let {merchantId,shopCount} = this;
					let shopCountAjax = await this.$fly.get('/app/order/count',{id:merchantId});
					this.shopCount = shopCountAjax.data;
				}catch(e){
					uni.showToast({
					    title: '拉取商品数量失败！',
					    duration: 2000
					});
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			},
			//获取列表
			async navListFun(){
				try{
					let {page,merchantId} = this;
					let param = {
						size:10,
						page,
						merchantId,
						sort:'createDate,asc',
						stockStatus:'soldOut',
					};
					uni.showLoading({
						title:'加载中'
					})
					let list = await this.$fly.get(`/app/mall/list`,param);
					uni.hideLoading();
					if(list.code!=0){
						uni.showToast({
						    title: list.message,
						    duration: 2000
						});
						return false;
					}
					let data = list.data;
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
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '拉取商品列表失败！',
					    duration: 2000
					});
					console.error(e)
				}
			},
			onClickUrl(url){
				uni.navigateTo({
					url
				})
			},
			//增加库存
			goodsAdd(row){
				this.$store.commit('SHOWPOPUP',true);
				this.goodsDetails(row.id)
			},
			//获取商品详情
			goodsDetails(id) {
				this.$fly.get(`/web/commodity/${id}`).then(res => {
					let {
						data
					} = res;
					this.goods = data;
				})
			},
		},
		onLoad() {
		},
		onShow() {
			this.init()
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
		box-sizing: border-box;
		&-info{
			width: calc(100% - 40rpx);
			margin: 0 20rpx;
			background-color: #fff;
			border-radius: 8rpx;
			padding: 20rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			color: #999;
			&-title{
				font-size: 26rpx;
			}
			&-item{
				display: flex;
				margin-bottom: 49rpx;
				&:last-child{
					margin-bottom: 10rpx;
				}
				&-list{
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					&-num{
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
						margin-bottom: 5rpx;
					}
				}
			}
		}
		&-label{
			width: calc(100% - 40rpx);
			margin:20rpx;
			background-color: #fff;
			border-radius: 8rpx;
			padding: 20rpx;
			box-sizing: border-box;
			font-size: 24rpx;
			color: #333333;
			&-title{
				color: #999999;
				font-size: 26rpx;
			}
			&-item{
				display: flex;
				align-items: center;
				margin-top:20rpx;
				.shop-label-list{
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					flex: 1;
					&-icon{
						width:60rpx;
						height:60rpx;
						background:rgba(255,166,70,1);
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius:8rpx;
						margin-bottom: 15rpx;
						&-img{
							width: 48rpx;
							height: 48rpx;
						}
					}
				}
			}
		}
		&-goods-title{
			font-size:28rpx;
			margin-left: 20rpx;
			color:rgba(153,153,153,1);
			margin-bottom: 20rpx;
		}
		&-goods{
			padding-top: 20rpx;
			background: #fff;
		}
	}
	
</style>
