<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="search flex_center">
				<image src="../../static/images/common/search.png" mode="widthFix"></image>
				<input type="text" :value="key" placeholder="请输入要搜索的内容" @confirm="search" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
			</view>
		</view>
		<view class="goods-list">
			<view class="goodsNav">
				<view class="goodsNav-list" :class="[goodsNavIndex===index?'active':'',topIndex==1?'down':'',topIndex==2?'up':'']" v-for="(item,index) in goodsNavList" :key="index" 
				@click="goodsListClick(index,item.key)">
					{{item.name}}
				</view>
			</view>
			<goods-list :list="list" type="list"></goods-list>
		</view>
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
				list:[],
				goodsNavList:[{name:'价格',key:''},{name:'销量',key:'sort_sale_desc'},{name:'活动'}],
				goodsNavIndex:0,
				topIndex:0,
				priceSort:['','sort_price','sort_price_desc'],
				key:'',
				sortType:'',
				searchType:'',
				page:0,
				cateId:''
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		methods:{
			init(){
				this.goodsList()
			},
			goodsList(){
				let {userId,sortType,page,searchType,cateId,key} = this;
				let param = {
					size:10,
					page,
					sort:'createDate,asc',
					userId:userId||'',
					key,
					cateId,
					sortType,
					searchType,
					commodityStatus:'online'
				};
				if(cateId){
					param.searchType = 'category'
				}
				
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/app/mall/list`,param).then(res=>{
					uni.hideLoading();
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
						this.list = []
					}
					this.list = this.list.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				}).catch(res=>{
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						duration: 2000
					});
				})
			},
			//切换分类
			goodsListClick(i,key){
				if(this.goodsNavIndex!==i){
					this.sortType = key || '';
					this.goodsNavIndex = i;
					this.page = 0
					this.goodsList()
				}else{
					if(i===0){
						if(this.topIndex==2){
							this.topIndex=0
						}else{
							this.topIndex ++;
						}
						this.sortType = this.priceSort[this.topIndex];
						this.page = 0
						this.goodsList()
					}
				}
			},
			search(e){
				this.key = e.detail.value;
				this.page = 0
				this.goodsList()
			}
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.goodsList();
		},
		onPullDownRefresh(){
			this.page = 0;
			this.goodsList();
		},
		onLoad(e){
			let {key,cateId} = e;
			this.cateId = cateId || '';
			this.key = key || '';
			this.init();
		}
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
	.goods-list{
		background: #fff;
		width: 100%;
		min-height: calc(100vh - 120rpx);
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
