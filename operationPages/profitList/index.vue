<template>
	<view class="container">
		<view class="main">
			<view class="fz-14 title">分润明细</view>
			<view class="item flex_between" v-for="item in list" :key="item.id">
				<view class="item_left flex_center">
					<view>
						<image :src="item.userHeadUrl" mode="widthFix"></image>
					</view>
					<view class="info">
						<view class="fz-12">{{item.createDate}}</view>
						<view class="fz-14">{{item.merchantName}}</view>
					</view>
				</view>
				<view class="status fz-16">+ {{item.feeAmount}}</view>
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
				status: 'more', //more,loading,noMore
				list:[],
				page:0,
				type:'',
			}
		},
		methods:{
			getList(type){
				this.status = 'loading'
				this.$fly.get(`/user/feeReportFind?type=${type}&page=${this.page}&userId=${this.$store.state.userInfo.id}`)
				.then(res=>{
					uni.stopPullDownRefresh();
					if(res.code == 0){
						let data = res.data.content;
						data.forEach(item=>{
							item.createDate = this.$util.formatTime(item.createDate);
						})
						this.list = this.list.concat(data);
						this.page++;
						if(this.page > res.data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}else{
						this.status = 'noMore';
					}
				})
			}
		},
		onLoad:function(query){
			this.getList(query.type);
			this.type = query.type;
		},
		onPullDownRefresh:function(){
			this.page = 0;
			this.list = [];
			this.getList(this.type);
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		width: 710rpx;
		margin: 0 auto;
		.title{
			padding: 20rpx;
			color: #999999;
		}
		.item{
			width: 100%;
			height: 140rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 8rpx;
			margin-bottom: 20rpx;
			color: #333;
			.item_left{
				image{
					width: 100rpx;
					height: 100rpx;
				}
				.info{
					margin-left: 20rpx;
					line-height: 36rpx;
					.fz-12{
						color: #999999;
					}
				}
			}
			.status{
				text-align: right;
				line-height: 40rpx;
				color: #FF9834;
			}
		}
	}
</style>
