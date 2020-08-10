<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="search flex_center">
				<image src="../../static/images/common/search.png" mode="widthFix"></image>
				<input type="text" placeholder="请输入要搜索的内容" :value="key" @confirm="search" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
			</view>
		</view>
		<view class="nav">
			<view class="nav-list" :class="{'active':index===navIndex}" v-for="(item,index) in navList" :key="index" @click="onSwitch(index,item.key)">
				{{item.name}}
			</view>
		</view>
		<!-- 精选 -->
		<view class="goods-list selected" v-if="navIndex===0">
			<goods-list shop="true" :list="goodsList"></goods-list>
		</view>
		<!-- 精选end -->
		<!-- 商品 -->
		<view class="goods-list" v-else-if="navIndex===1">
			<view class="goodsNav">
				<view class="goodsNav-list" :class="[goodsNavIndex===index?'active':'',topIndex==1?'down':'',topIndex==2?'up':'']" v-for="(item,index) in goodsNavList" :key="index" 
				@click="goodsListClick(index,item.key)">
					{{item.name}}
				</view>
			</view>
			<goods-list shop="true" :list="goodsList" type="list"></goods-list>
		</view>
		<!-- 商品end -->
		<!-- 活动 -->
		<!-- <view class="goods-list hot" v-else-if="navIndex===2">
			<image class="hot-img" src="../../static/images/business/codebg.png"></image>
			<view class="hot-title">参加夺宝活动商品</view>
			<goods-list shop="true" :list="goodsList"></goods-list>
		</view> -->
		<!-- 活动end -->
		<!-- 上新 -->
		<view class="goods-list new" v-else-if="navIndex===2">
			<view class="new-list" v-for="(item,index) in newGoodsList" :key="item.date">
				<view class="new-list-time">
					<view class="time-txt">{{item.date}} 上新商品</view>
					<view class="time-xi"></view>
				</view>
				<goods-list shop="true" :list="item.commodityList"></goods-list>
			</view>
		</view>
		<!-- 上新end -->
		<!-- 购物车按钮组件 -->
		<cart-btn></cart-btn>
	</view>
</template>

<script>
	import goodsList from '@/my-component/goodsList/index'
	import cartBtn from '@/my-component/cart/cartBtn'
	export default{
		components:{goodsList,cartBtn},
		data(){
			return{
				// {name:'活动',key:'draw'},
				navList:[
					{name:'精选'},
					{name:'商品'},
					{name:'上新',key:'newGoods'}
				],
				navIndex:0,//navindex
				goodsNavList:[{name:'价格',key:''},{name:'销量',key:'sort_sale_desc'}],//商品筛选
				goodsNavIndex:0,//商品index
				topIndex:0,
				priceSort:['','sort_price','sort_price_desc'],//筛选价格
				key:'',
				goodsList:[],
				newGoodsList:[],
				merchantId:'',
				page:0,
				searchType:'',
				sortType:''
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			}
		},
		methods:{
			init(){
				this.navListFun()
			},
			//搜索
			search(e){
				this.key = e.detail.value;
				this.page = 0
				this.navListFun();
				this.navIndex = 1;
			},
			onSwitch(i,key){
				this.sortType = ''
				this.navIndex = i;
				this.page = 0
				this.searchType = key || '';
				this.key = '';
				if(key==='newGoods'){
					this.shopNew()
				}else{
					this.navListFun()
				}
			},
			//切换分类
			goodsListClick(i,key){
				if(this.goodsNavIndex!==i){
					this.sortType = key || '';
					this.goodsNavIndex = i;
					this.page = 0
					this.navListFun()
				}else{
					if(i===0){
						if(this.topIndex==2){
							this.topIndex=0
						}else{
							this.topIndex ++;
						}
						this.sortType = this.priceSort[this.topIndex];
						this.page = 0
						this.navListFun()
					}
				}
			},
			//店铺上新
			async shopNew(){
				try{
					let {merchantId,page} = this;
					let param = {
						size:10,
						page,
						sort:'createDate,asc',
						merchantId,
					};
					uni.showLoading({
						title:'加载中'
					})
					let newShop = await this.$fly.get(`/app/mall/shopNew`,param);
					uni.hideLoading();
					if(newShop.code!=0){
						uni.showToast({
						    title: newShop.message,
						    duration: 2000
						});
						return false;
					}
					let data = newShop.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.newGoodsList = []
					}
					this.newGoodsList = this.newGoodsList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
					
				}catch(e){
					//TODO handle the exception
					console.error(e)
					uni.showToast({
					    title: '拉取商品列表失败！！',
					    duration: 2000
					});
				}
			},
			//获取列表
			async navListFun(){
				try{
					let {userId,merchantId,sortType,key,searchType,page} = this;
					let param = {
						size:10,
						page,
						sort:'createDate,asc',
						userId,
						merchantId,
						sortType,
						searchType,
						key,
						commodityStatus:'online'
					};
					uni.showLoading({
						title:'加载中'
					})
					let nav = await this.$fly.get(`/app/mall/list`,param);
					uni.hideLoading();
					if(nav.code!=0){
						uni.showToast({
						    title: nav.message,
						    duration: 2000
						});
						return false;
					}
					
					let data = nav.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.goodsList = []
					}
					this.goodsList = this.goodsList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
					
				}catch(e){
					//TODO handle the exception
					console.error(e)
					uni.showToast({
					    title: '拉取商品列表失败！！',
					    duration: 2000
					});
				}
			},
		},
		onLoad(res) {
			this.merchantId = res.merchantId;
			this.init()
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			
			if(this.searchType ==='newGoods'){
				this.shopNew()
			}else{
				this.navListFun()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.bg{
		// padding-top: 100rpx;
		background: #f2f2f2;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		.top{
			width: 100%;
			height: 120rpx;
			padding: 0 20rpx;
			border-top: 2rpx solid #FFFFFF;
			box-sizing: border-box;
			z-index: 500;
			.location{
				image{
					width: 44rpx;
					display: block;
					margin-right: 10rpx;
				}
			}
			.search{
				width: 100%;
				height: 60rpx;
				border-radius: 30rpx;
				background: #fff;
				justify-content: flex-start;
				input{
					background: #fff;
					width: 627rpx;
					font-size: 28rpx;
					height: 40rpx;
				}
				image{
					width: 28rpx;
					display: block;
					margin: 0 20rpx;
				}
			}
		}
		::-webkit-scrollbar{                    
				opacity: 0;
		}
	}
	.nav{
		width: 100%;
		box-sizing: border-box;
		margin: 20rpx 0;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
		&-list{
			flex: 1;
			font-size:28rpx;
			color:#333;
			display: flex;
			justify-content: center;	
			&.active{
				color: #FF9D12;
			}
		}
	}
	.goods-list{
		background: #fff;
		width: 100%;
		min-height: calc(100vh - 198rpx);
		&.new{
			background: none;
			.new-list{
				&-time{
					width: calc(100% - 40rpx);
					position: relative;
					height: 40rpx;
					z-index: 5;
					margin: 20rpx;
					.time-txt{
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						background: #efefef;
						padding: 0 15rpx;
						z-index: 2;
						line-height: 40rpx;
						font-size: 28rpx;
					}
					.time-xi{
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: 100%;
						height: 1rpx;
						background: #dedede;
						z-index: 1;
					}
				}
			}
		}
		&.selected{
			background: none;
		}
		&.hot{
			background: none;
			.hot-img{
				width: 100%;
				padding: 0 20rpx;
				height: 300rpx;
				border-radius: 8rpx;
				margin: 20rpx 0;
				box-sizing: border-box;
			}
			.hot-title{
				position: relative;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 20rpx 0;
				font-size:28rpx;
				color:rgba(51,51,51,1);
				&::before,&::after{
					content:"";
					position: absolute;
					width: 35rpx;
					height: 26rpx;
					background: url(../../static/images/shop/hot.png);
					background-size: 35rpx 26rpx;
				}
				&::before{
					left: 50%;
					transform: translateX(-450%);
				}
				&::after{
					right: 50%;
					transform: translateX(450%);
				}
			}
		}
		.goodsNav{
			margin: 20rpx;
			display: flex;
			.goodsNav-list{
				font-size:28rpx;
				color:#999999;
				margin-right: 100rpx;
				&.active{
					color: #333;
				}
				&:first-child{
					position: relative;
					&::before{
						position: absolute;
						width: 10rpx;
						height: 14rpx;
						content: "";
						background: url(../../static/images/shop/all.png) no-repeat;
						background-size: 10rpx 14rpx;
						right: -20rpx;
						top: 15rpx;
					}
					&.up{
						&::before{
							background: url(../../static/images/shop/up.png) no-repeat;
							background-size: 10rpx 14rpx;
						}
					}
					&.down{
						&::before{
							background: url(../../static/images/shop/down.png) no-repeat;
							background-size: 10rpx 14rpx;
						}
					}
				}
			}
			
		}
	}
</style>
