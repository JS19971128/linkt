<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="search flex_center">
				<image src="../../static/images/common/search.png" mode="widthFix"></image>
				<input type="text" placeholder="请输入要搜索的内容" @click="onClick" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx" disabled="true"/>
			</view>
		</view>
		<!-- 导航切换 -->
		<view class="nav">
			<tab-nav class="nav-list" :tabNav="navbarList" @clickTabItem="clickTabItem"></tab-nav>
			<image class="nav-img" @click="onClickClass" src="../../static/images/shop/more.png"></image>
		</view>
		<block v-if="navTabListIndex==0">
			<!-- banner -->
			<view class="swiper">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="5000" :circular="true" :duration="1000">
					<swiper-item v-for="item in article" :key="item.id">
						<view class="swiper-item">
							<image class="banner-img" :src="item.mainUrl" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 推荐栏 -->
			<view class="box-wrapper">
				<view class="box-wrapper-list" v-for="item in boxWrapper" :key="item" @click="boxWrapperFun(item)">
					<p class="box-wrapper-list-title">{{item.title}}</p>
					<image class="box-wrapper-list-bg" :src="item.bg"></image>
					<image src="../../static/images/shop/right.png" class="box-wrapper-list-img"></image>
				</view>
			</view>
			<!-- tab切换 -->
			<tab-list :tabList="tabList" @clickTabItem="clickTabListItem"></tab-list>
		</block>
		<block v-else>
			<view class="main">
				<view class="main-title">热卖推荐</view>
				<scroll-view class="scroll" scroll-x="true" scroll-left="0" @scroll="scrollActive">
					<view class="scroll-item">
						<view class="scroll-item-list" v-for="(item,index) in hotList" :key="index" @click="goCommodity(item.id)">
							<image :src="item.listUrl" class="scroll-item-list-img"></image>
							<view class="scroll-item-list-title">{{item.commodityName}}</view>
							<view class="scroll-item-list-detail">
								<view class="price">
									<text class="price-f">￥</text>{{item.priceSale}}
								</view>
								<view class="info">已售{{item.saleSum | toChineseNum}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="scroll-bar">
					<view class="scroll-active" :style="{left:slideLeft+'rpx'}"></view>
				</view>
			</view>
			<view class="hot-title">更多热卖</view>
		</block>
		<!-- 购物车按钮组件 -->
		<cart-btn></cart-btn>
		<!-- tab切换的列表 -->
		<goods-list :list="navList"></goods-list>
	</view>
</template>

<script>
	import goodsList from '@/my-component/goodsList/index'
	import tabNav from '@/my-component/tab/tabNav'
	import tabList from '@/my-component/tab/tabList'
	import cartBtn from '@/my-component/cart/cartBtn'
	export default{
		data() {
			return {
				article:[],
				page:0,//页码
				status:'noMore',//请求切换
				navTabListIndex:0,//tab选中index
				//tab数据
				navbarList:[{label:'首页',value:''}],
				// 子集tab数据
				tabList:[{title:'精选',info:'猜你喜欢',key:'sort_sale_desc'},{title:'实惠',info:'特惠推荐',key:'sort_profit_desc'},{title:'最新',info:'好物上新',key:'sort_time_desc'}],
				// 推荐栏数据
				boxWrapper:[
					{title:'每日爆品',bg:require('@/static/images/shop/shape1.png'),url:'',key:'dailyHot'},
					{title:'商家自营',bg:require('@/static/images/shop/shape2.png'),url:'',key:'merchant'},
					{title:'平台直营',bg:require('@/static/images/shop/shape3.png'),url:'',key:'selfManage'},
					{title:'一乡一品',bg:require('@/static/images/shop/shape4.png'),url:'',key:''},
					{title:'免税商品',bg:require('@/static/images/shop/shape5.png'),url:'',key:''},
					// {title:'夺宝专区',bg:require('@/static/images/shop/shape6.png'),url:'',key:'draw'}
				],
				//产品数据
				navList:[],
				//屏幕宽度
				windowWidth:'',
				// 滑动对左偏移量
				slideLeft:'',
				//热卖推荐
				hotList:[],
				cateIdStatus:false,
				rootCateId:'',//分类id
				sortType:''
			}
		},
		components:{goodsList,tabNav,tabList,cartBtn},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		watch:{
			userId(val){
				if(val){
					this.clickTabListItem()
				}
			}
		},
		methods:{
			init(){
				this.getWindowWidth();
				this.banner();
				this.navbarList = [{label:'首页',value:''}]
				this.navbarListFun();
			},
			goCommodity(id){
				let str = `?id=${id}`;
				uni.navigateTo({
					url:`/shoppingPages/commodity/index${str}`
				})
			},
			//navbarList  分类数据
			async navbarListFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let categoryId = 1;
					let navbar = await this.$fly.get(`/commodity/categroy/tree/${categoryId}`);
					uni.hideLoading();
					if(navbar.code!=0){
						uni.showToast({
						    title: navbar.message,
						    duration: 2000
						});
						return false;
					}
					let data = navbar.data;
					this.navbarList.push(...data);
				}catch(e){
					//TODO handle the exception
					console.error(e)
					uni.showToast({
					    title: '拉取分类失败！！',
					    duration: 2000
					});
				}
			},
			//banner  获取
			banner(){
				this.$fly.get(`/app/mall/home`).then(res=>{
					this.article = res.data.banners
				})
			},
			//获取列表
			navListFun(){
				let {rootCateId,userId,sortType,page} = this;
				let param = {
					size:10,
					page,
					sort:'createDate,asc',
					rootCateId,
					userId,
					sortType,
					commodityStatus:'online'
				};
				if(rootCateId){
					param.searchType = 'category'
				}
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/app/mall/list`,param).then(res=>{
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if(res.code!=0){
						uni.showToast({
						    title: res.message,
						    duration: 2000
						});
						return false;
					}
					let data = res.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.navList = []
					}
					
					
					if(rootCateId || this.cateIdStatus){
						this.cateIdStatus = false;
						this.hotList = data.content.splice(0,6);
					}
					this.navList = this.navList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
					
				}).catch(res=>{
					uni.hideLoading();
					uni.stopPullDownRefresh();
					uni.showToast({
					    title: res.message,
					    duration: 2000
					});
				})
			},
			//获取navtab切换的index
			clickTabItem(e){
				console.log(e,'navtab')
				let {navTabListIndex} = this;
				if(navTabListIndex === e) return false
				
				this.page = 0;
				
				if(e!==0){
					this.rootCateId = this.navbarList[e].value
					this.cateIdStatus = true;
					this.sortType = '';
					this.navListFun();
				}else{
					this.rootCateId = '';
					this.clickTabListItem()
				}
				this.navTabListIndex = e;
			},
			//获取tab切换的index
			clickTabListItem(e){
				console.log(e,'tablist')
				this.sortType = this.tabList[e||0].key;
				this.page = 0;
				this.navListFun();
			},
			//跳转搜索页
			onClick(){
				uni.navigateTo({
					url:`/shoppingPages/search/index`
				})
			},
			//跳转分类页
			onClickClass(){
				uni.navigateTo({
					url:`/shoppingPages/classify/index`
				})
			},
			//跳转专区页面
			boxWrapperFun(row){
				if(row.key === 'draw'){
					uni.navigateTo({
						url:`/shoppingPages/raidersZone/index`
					})
				}else{
					uni.navigateTo({
						url:`/shoppingPages/prefecture/index?title=${row.title}&searchType=${row.key}`
					})
				}
				
			},
			//自定义滚动条
			scrollActive($event){ 
				let total = ($event.detail.scrollWidth) * (750 / this.windowWidth) - 750;
				let scroll = ($event.detail.scrollLeft) * (750 / this.windowWidth);
				let scale = (scroll / total).toFixed(2);
				
				let result = 80 * scale;
				if(scale > 1){
					this.slideLeft = 80;
					return
				}
				this.slideLeft = result;
			},
			//获取屏幕宽度
			getWindowWidth(){ 
				uni.getSystemInfo({
					success: (res) => {
						this.windowWidth = res.windowWidth;
					}
				})
			},
		},
		onShow() {
			// this.init()
		},
		onLoad() {
			if(this.userId){
				this.clickTabListItem()
			}
		},
		created() {
			if(!this.$store.state.userInfo.uid){
				this.$wxLogin();
			}
			this.init()
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
		onPullDownRefresh(){
			// this.clickTabListItem()
			if(!this.$store.state.userInfo.uid){
				this.$wxLogin();
			}
			this.page = 0;
			this.navListFun();
			this.init()
		},
		filters:{
			toChineseNum(num){
				if(num>10000){
					return (num / 10000).toFixed(1)+'万'
				}else{
					return num;
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.bg{
		// padding-top: 100rpx;
		background: #f2f2f2;
		min-height: 100vh;
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
	
	.swiper{
		height: 260rpx;
		.swiper-item{
			.banner-img{
				padding: 0 20rpx;
				width: 710rpx;
				height: 260rpx;
				border-radius: 8rpx;
			}
		}
	}
	.navbar{
		display: flex;
		align-items: center;
		padding-left: 40rpx;
		margin: 40rpx 0;
		.navbar-list{
			font-size: 28rpx;
			color: #AAAAAA;
			margin-right: 60rpx;
			&.active{
				color: #282828;
			}
		}
	}
	
	.box-wrapper{
		margin: 20rpx 0;
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		&-list{
			width:223rpx;
			height:140rpx;
			border-radius:8rpx;
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			padding-left: 21rpx;
			padding-top: 30rpx;
			position: relative;
			letter-spacing: 3rpx;
			box-sizing: border-box;
			
			$gradient:(
				(gradient:linear-gradient(235deg,#FF8616,#FFC67C)),
				(gradient:linear-gradient(235deg,#FF402D,#FD845A)),
				(gradient:linear-gradient(235deg,#FFC923,#F7E270)),
				(gradient:linear-gradient(235deg,#25C114,#75E169)),
				(gradient:linear-gradient(235deg,#B72DFF,#DCA4FF)),
				(gradient:linear-gradient(235deg,#3972F3,#67B0FB)),
			);
			@for $i from 1 through length($gradient) {
				$item: nth($gradient, $i);
				&:nth-child(#{$i}){
				  background:map-get($item,gradient);
				}
			}
			&:nth-child(3n){
				margin-right: 0;
			}
			&-title{
				font-size:32rpx;
				font-weight:800;
				color:rgba(255,255,255,1);
				text-shadow:0px 1rpx 6rpx rgba(0, 0, 0, 0.15);
				line-height: 1;
			}
			&-bg{
				width: 120rpx;
				height: 120rpx;
				position: absolute;
				right: 11rpx;
				bottom: 10rpx;
			}
			&-img{
				width: 42rpx;
				height: 42rpx;
				position: absolute;
				z-index: 5;
				right: 19rpx;
				bottom: 30rpx;
			}
		}
	}
	
	.nav{
		overflow: hidden;
		margin-bottom: 16rpx;
		&-list{
			width: 680rpx;
			float: left;
		}
		&-img{
			width: 30rpx;
			height: 30rpx;
			float: left;
			margin-left: 20rpx;
			margin-top: 5rpx;
		}
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
			transform: translateX(-350%);
		}
		&::after{
			right: 50%;
			transform: translateX(350%);
		}
	}
	.main{
		background: #fff;
		border-radius: 8rpx;
		margin: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		&-title{
			font-size:26rpx;
			font-weight:bold;
			color:rgba(51,51,51,1);
			margin-bottom: 20rpx;
		}
		.scroll{
			.scroll-item{
				display: flex;
				justify-content: flex-start;
				&-list{
					padding-right:22rpx;
					white-space: nowrap;
					display: flex;
					flex-direction: column;
					color: #333;
					line-height: 40rpx;
					width:190rpx;
					line-height: 1;
					&-title{
						overflow:hidden;
						white-space:nowrap; 
						text-overflow:ellipsis; 
						font-size:26rpx;
						font-weight:bold;
						color:rgba(51,51,51,1);
						margin: 15rpx 0;
					}
					&-img{
						width:190rpx;
						height:190rpx;
						border-radius:8rpx;
					}
					&-detail{
						display: flex;
						align-items: center;
						.price{
							font-size:24rpx;
							color:rgba(255,152,52,1);
							flex: 1;
							overflow:hidden;
							white-space:nowrap; 
							text-overflow:ellipsis;
							&-f{
								font-size: 18rpx;
							}
						}
						.info{
							width: 90rpx;
							font-size:20rpx;
							color:rgba(153,153,153,1);
						}
					}
				}
			}
		}
		.scroll-bar{
			width: 120rpx;
			height: 8rpx;
			border-radius: 4rpx;
			background: #E6E6E6;
			position: relative;
			margin: 20rpx auto;
			.scroll-active{
				position: absolute;
				left: 0;
				top: 0;
				width: 40rpx;
				height: 8rpx;
				border-radius: 4rpx;
				background: #FF9D11;
			}
		}
	}
</style>
