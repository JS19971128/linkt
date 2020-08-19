<template>
	<view class="container">
		<view class="top flex_center">
			<view class="search flex_center">
				<view class="pic">
					<image src="../../static/images/common/search.png" mode="widthFix"></image>
				</view>
				<view class="content flex_center">
					<input type="text" placeholder="请输入要搜索的内容" v-model="searchKey" placeholder-style="color:#CBCBCB;font-size:28rpx" @blur="search"/>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="item flex_center" v-for="item in list" :key="item.id" @click="goStoreDetail(item)">
				<view class="item-left">
					<image :src="item.shopUrl" mode="aspectFill"></image>
				</view>
				<view class="item-right">
					<view class="flex_between info">
						<view class="flex_center">
							<view class="fz-14 name">{{item.shopNickName}}</view>
							<view class="fz-12 status flex_center" :class="{open:item.shopStatus=='营业',close:item.shopStatus=='休息'}">{{item.shopStatus}}</view>
						</view>
						<view class="fz-12">{{item.distance}}km</view>
					</view>
					<view class="fz-12 coupon">最高可享{{profitsDiscount(item.profits)}}折</view>
					<view class="fz-12">{{item.shopBusinessName || ''}} {{item.location}}</view>
					<view class="address flex_center">
						<view><image src="../../static/images/common/location.png" mode="widthFix"></image></view>
						<view class="fz-12">{{item.contactAddress}}</view>
					</view>
					<view class="heat flex_center">
						<view class="flex_center">
							<view><image src="../../static/images/common/heat.png" mode="widthFix"></image></view>
							<view class="fz-12">{{item.pageViews}}</view>
						</view>
						<view class="flex_center comment">
							<view><image src="../../static/images/common/order_quantity.png" mode="widthFix"></image></view>
							<view class="fz-12">{{item.orderCount}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'loading', //more,loading,noMore
				page:0,
				list:[],
				searchKey:'',
				shopType:'',
			}
		},
		methods:{
			profitsDiscount(profits){
				let shop = ((profits*10)*(0.7*10))/100; //70%可以用优惠券抵扣
				let transform = ((100*10)-(shop*10))/100; //100份分成10份算折扣
				return transform;
			},
			goStoreDetail(item){ //进入商户详情页面
				uni.navigateTo({
					url:`/pages/shopDetails/index?id=${item.id}&discount=${item.profits}&start=${item.shopStartTime}&stop=${item.shopStopTime}&heat=${item.pageViews}&order=${item.orderCount}`
				})
			},
			search(){ //搜索
				this.page = 0;
				this.list = [];
				this.status = 'loading';
				this.getList();
			},
			getList(){ //获取商户列表
				this.$fly.get(`${this.url}?longitude=${this.$store.state.longitude}&latitude=${this.$store.state.latitude}&page=${this.page}&key=${this.searchKey}&shopBusinessId=${this.shopType}`)
				.then(res=>{
					if(res.code == 0){
						let data = res.data.content;
						let hours = new Date().getHours();
						let minutes = new Date().getMinutes();
						let start = new Date();
						let stop = new Date();
						let now = new Date();
						data.forEach(item=>{
							item.location = item.area.split(' ')[2];
							let startHours = parseInt(item.shopStartTime.split(':')[0]);
							let startMinutes = parseInt(item.shopStartTime.split(':')[1]);
							let stopHours = parseInt(item.shopStopTime.split(':')[0]);
							let stopMinutes = parseInt(item.shopStopTime.split(':')[1]);
							start.setHours(startHours);
							start.setMinutes(startMinutes);
							start.setDate(1);
							stop.setHours(stopHours);
							stop.setMinutes(stopMinutes);
							if(startHours <= stopHours){
								// 营业时间不超过零点的商户
								stop.setDate(1);
							}else{
								// 营业时间超过零点的商户
								stop.setDate(2);
							}
							now.setHours(hours);
							now.setMinutes(minutes);
							now.setDate(1);
							if(now.getTime() - start.getTime() >= 0 && now.getTime() - stop.getTime() <= 0){
								item.shopStatus = '营业';
							}else{
								item.shopStatus = '休息';
							}
						})
						this.list = this.list.concat(res.data.content);
						this.page++;
						if(this.page > res.data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}
				})
				.catch(err=>{
					this.status = 'noMore';
				})
			}
		},
		onReachBottom: function(){ //触底加载
			if(this.status=='noMore'){
				return
			}
			this.status = 'loading';
			this.getList();
		},
		onLoad:function(query){
			// 判断是推荐商家进入还是行业分类进入
			if(query.type=='category'){
				this.url = '/home/list/nearby'
				if(query.searchKey){
					this.searchKey = query.searchKey;
				}
			}else{
				this.url = '/home/list/recommend'
			}
			this.shopType = query.id || '';
			this.getList()
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		background: #EEEEEE;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		.search{
			width: 708rpx;
			height: 64rpx;
			border-radius: 32rpx;
			background: #fff;
			justify-content: flex-start;
			view{
				margin-left: 20rpx;
			}
			.pic{
				width: 5%;
				image{
					width: 26rpx;
				}
			}
			.content{
				width: 95%;
				justify-content: flex-start;
				input{
					width: 600rpx;
					font-size: 28rpx;
					line-height: 28rpx;
					color: #333;
					padding: 0;
				}
			}
		}
	}
	.main{
		padding-top: 104rpx;
		.item{
			border-bottom: 2rpx solid #DDDDDD;
			padding: 20rpx 0;
			background: #fff;
			align-items: flex-start;
			.item-left{
				width: 220rpx;
				image{
					width: 200rpx;
					height: 200rpx;
					margin-left: 20rpx;
					display: block;
					border-radius: 8rpx;
				}
			}
			.item-right{
				width: 528rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				color: #999;
				>view{
					margin-bottom: 16rpx;
					&:last-child{
						margin: 0;
					}
				}
				.info{
					width: 100%;
					>view{
						&:first-child{
							width: 70%;
							justify-content: flex-start;
							.name{
								max-width: 80%;
								color: #333;
								line-height: 28rpx;
								font-weight: bold;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
							.status{
								width: 56rpx;
								height: 30rpx;
								color: #fff;
								border-radius: 4rpx;
								margin-left: 10rpx;
								line-height: 24rpx;
								transform: scale(0.8);
							}
						}
					}
					.open{
						background: #10CC1E;
					}
					.close{
						background: #CBCBCB;
					}
				}
				.coupon{
					color: #FF9D12;
					line-height: 24rpx;
				}
				.address{
					justify-content: flex-start;
					line-height: 24rpx;
					.fz-12{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					image{
						width: 28rpx;
						display: block;
						margin-right: 10rpx;
					}
				}
				.heat{
					justify-content: flex-start;
					line-height: 24rpx;
					image{
						width: 24rpx;
						display: block;
						margin-right: 10rpx;
					}
					.comment{
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
