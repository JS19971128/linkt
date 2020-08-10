<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="search flex_center">
				<image src="../../static/images/common/search.png" mode="widthFix"></image>
				<input type="text" placeholder="请输入要搜索的内容" @confirm="search" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
			</view>
		</view>
		<view class="box">
			<view class="history">
				<p class="history-title">历史搜索</p>
				<view class="history-item">
					<view class="history-item-list" v-for="(item,index) in history" :key="index" @click="ClickSearch(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="hot">
				<view class="hot-title">热门搜索</view>
				<view class="hot-item">
					<view class="hot-item-list" v-for="(item,index) in hotList" :key="index" @click="ClickSearch(item)">
						<p class="hot-item-list-title">{{item}}</p>
						<view class="hot-top">{{index+1}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				history:[],
				hotList:[]
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		methods: {
			search(e){
				uni.redirectTo({
					url:`/shoppingPages/goodsList/index?key=${e.detail.value}`
				})
			},
			ClickSearch(e){
				uni.redirectTo({
					url:`/shoppingPages/goodsList/index?key=${e}`
				})
			},
			init(){
				this.searchList()
			},
			async searchList(){
				try{
					let {userId} = this;
					let param = {
						userId
					}
					uni.showLoading({
						title:'加载中'
					})
					
					let search = await this.$fly.get(`/app/mall/searchList`,param)
					uni.hideLoading();
					if(search.code!=0){
						uni.showToast({
							title: search.message,
							duration: 2000
						});
						return false;
					}
					//最近搜索
					this.history = search.data.lastSearchList.slice(0,15);
					//热门搜索
					this.hotList = search.data.hotSearchList.slice(0,5);
				}catch(e){
					uni.showToast({
						title: '拉取列表失败',
						duration: 2000
					});
					console.error(e)
				}
			}
		},
		onLoad() {
			this.init()
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
	.box{
		background: #fff;
		width: 100%;
		flex: 1;
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
	}
	.history{
		line-height: 1;
		flex: 1;
		&-title{
			font-size:28rpx;
			color:#333333;
		}
		&-item{
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;
			box-shadow:1px 0px 0px 0px rgba(222,222,222,1);
			&-list{
				font-size:28rpx;
				color:#777777;
				padding: 10rpx 20rpx;
				background:#eee;
				border-radius:23rpx;
				margin-left: 20rpx;
				margin-bottom: 20rpx;
				&:first-child{
					margin-left: 0;
				}
			}
		}
	}
	.hot{
		width: 260rpx;
		padding-left: 20rpx;
		&-title{
			font-size:28rpx;
			color:#333333;
		}
		&-item{
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			&-list{
				height: 54rpx;
				width: 240rpx;
				display: flex;
				align-items: center;
				position: relative;
				justify-content: space-between;
				&-title{
					font-size:28rpx;
					color:#666;
					overflow:hidden;
					white-space:nowrap; 
					text-overflow:ellipsis;
				}
				.hot-top{
					padding-right: 16rpx;
					font-size:24rpx;
					font-style:italic;
					color:#999999;
					&::before{
						position: absolute;
						right: -1rpx;
						top: 0;
						width: 22rpx;
						height: 20rpx;
					}
				}
				$color:(
					(color:#FBBE5E),
					(color:#C9C9C9),
					(color:#D28B1B),
				);
				@for $i from 1 through length($color) {
					$item: nth($color, $i);
					&:nth-child(#{$i}){
					  .hot-top{
					  	color:map-get($item, color);
					  	&::before{
					  		content: "";
					  		background: url('../../static/images/shop/top#{$i}.png') no-repeat;
					  		background-size: 22rpx 20rpx;
					  	}
					  }
					}
				}
			}
		}
	}
</style>
