<template>
	<view class="all">
		<view class="tab flex_center fz-14">
			<view class="item flex_center" :class="{active:current == item.value}" v-for="(item,i) in tab" :key="i" @click="changeTab(item.value)">{{item.text}}</view>
		</view>
		<scroll-view scroll-y="true" class="main" @scrolltolower="getReachBottom" lower-threshold="0">
				<view class="item flex_center" v-for="item in list" :key="item.id" @click="goStoreDetail(item)">
					<view class="item-left">
						<image class="shop_pic" :src="item.shopUrl" mode="aspectFill"></image>
					</view>
					<view class="item-right">
						<view class="flex_between info">
							<view class="flex_center shop">
								<view class="fz-14 name">{{item.shopNickName}}</view>
								<view class="fz-12 status flex_center" :class="{open:item.shopStatus=='营业',close:item.shopStatus=='休息'}">{{item.shopStatus}}</view>
							</view>
							<view class="fz-12">{{item.distance}}km</view>
						</view>
						<view class="fz-12 coupon">最高可享{{profitsDiscount(item.profits)}}折</view>
						<view class="fz-12">{{item.shopBusinessName || ''}} {{item.location}}</view>
						<view class="address flex_center">
							<view><image class="location" src="../../static/images/common/location.png" mode="widthFix"></image></view>
							<view class="fz-12">{{item.contactAddress}}</view>
						</view>
						<view class="heat flex_center">
							<view class="flex_center">
								<view><image class="heat_pic" src="../../static/images/common/heat.png" mode="widthFix"></image></view>
								<view class="fz-12">{{item.pageViews}}</view>
							</view>
							<view class="flex_center comment">
								<view><image class="heat_pic" src="../../static/images/common/order_quantity.png" mode="widthFix"></image></view>
								<view class="fz-12">{{item.orderCount}}</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</scroll-view>
		
	</view>
</template>

<script>
	import {profitsDiscount} from '@/common/util/public.js'
	export default{
		name:'businessList',
		data() {
			return {
				current:'NEARBY',
				tab:[
					{id:1,text:'附近',value:'NEARBY'},
					{id:2,text:'人气',value:'PEOPLE_LIKES'},
					{id:3,text:'新入',value:'LASTEST'},
					{id:4,text:'优惠排名',value:'MOST_FAVORABLE'}
				],
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'loading', //more,loading,noMore
				page:0,
				list:[],
				flg:true
			}
		},
		computed:{
			latitude(){
				return this.$store.state.latitude;
			},
			longitude(){
				return this.$store.state.longitude;
			}
		},
		watch:{
			latitude(){
				this.page = 0;
				this.list = [];
				this.status = 'loading';
				this.getList();
			}
		},
		methods:{
			profitsDiscount,
			changeTab(value){
				this.current = value;
				this.page = 0;
				this.list = [];
				this.status = 'loading';
				this.getList();
			},
			getReachBottom(){ //上拉加载
				if(this.status=='noMore' || !this.flg){
					return
				}
				this.status = 'loading';
				this.flg = false
				this.getList();
			},
			
			getList(){ //获取商家列表
				
				this.$fly.get(`/home/list/nearby?merchantSortType=${this.current}&longitude=${this.longitude}&latitude=${this.latitude}&page=${this.page}`)
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
						if(this.page > (res.data.totalPages - 1)){
							this.status = 'noMore';
							return
						}
						this.status = 'more';
					}
					this.flg = true
				})
				.catch(err=>{
					this.status = 'noMore';
				})
			},
			goStoreDetail(item){ //进入商户详情页面
				uni.navigateTo({
					url:`/pages/shopDetails/index?id=${item.id}&discount=${item.profits}&start=${item.shopStartTime}&stop=${item.shopStopTime}&heat=${item.pageViews}&order=${item.orderCount}`
				})
			},
		},
		mounted() {
			if(this.latitude){
				this.getList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.all{
		.tab{
			background: #EEEEEE;
			color: #999999;
			height: 85rpx;
			.item{
				flex: 1;
			}
			.active{
				color: #FF9733;
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
					top: 40rpx;
				}
			}
		}
		.main{
			height: 90vh;
			.item{
				width: 750rpx;
				border-bottom: 2rpx solid #DDDDDD;
				padding: 20rpx 0;
				background: #fff;
				align-items: flex-start;
				.item-left{
					width: 220rpx;
					.shop_pic{
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
					.info{
						margin-bottom: 16rpx;
						width: 100%;
						.shop{
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
						margin: 16rpx 0;
					}
					.address{
						justify-content: flex-start;
						line-height: 24rpx;
						margin: 16rpx 0;
						.location{
							width: 28rpx;
							display: block;
							margin-right: 10rpx;
						}
						.fz-12{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
					.heat{
						justify-content: flex-start;
						line-height: 24rpx;
						.heat_pic{
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
	}
</style>
