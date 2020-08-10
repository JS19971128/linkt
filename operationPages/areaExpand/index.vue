<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="search flex_center">
				<view><image src="../../static/images/common/search.png" mode="widthFix"></image></view>
				<view><input type="text" v-model="searchKey" confirm-type="search" @confirm="search" placeholder="请输入要搜索的内容" placeholder-style="color:#CBCBCB;font-size:28rpx"/></view>
			</view>
			<view><text class="fz-12">拓展员总数</text><text class="fz-24">{{total}}</text></view>
		</view>
		<view class="no_data flex_center" v-if="noData">
			<image src="../../static/images/operation/expand_none.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">暂无拓展员</view>
				<view class="fz-12">您的区域还没有拓展员呢~</view>
			</view>
		</view>
		<view class="main" v-else>
			<view class="item flex_center" v-for="item in list" :key="item.id">
				<view class="item-left flex_center">
					<!-- #ifdef MP-ALIPAY -->
					<view><image :src="item.aliAvatar || '../../static/images/my/avatar.png'" mode="widthFix"></image></view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view><image :src="item.wechatHeadImg || '../../static/images/my/avatar.png'" mode="widthFix"></image></view>
					<!-- #endif -->
				</view>
				<view class="item-right ">
					<view class="flex_between info">
						<!-- #ifdef MP-ALIPAY -->
						<view class="fz-14">{{item.aliNickName || '-'}}</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="fz-14">{{item.username}}</view>
						<!-- #endif -->
						<view class="fz-12">{{item.createDate}}</view>
					</view>
					<view class="flex_between">
						<view class="fz-12">UID:{{item.uid}}</view>
						<image :src="item.starIcon" mode="widthFix"></image>
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
				status: 'noMore', //more,loading,noMore
				list:[],
				page:0,
				total:0,
				searchKey:'',
				noData:false,
			}
		},
		methods:{
			search(){  //搜索
				this.list = [];
				this.page = 0;
				this.getList();
			},
			getList(){  //获取区域拓展员列表
				this.status = 'loading';
				this.$fly.get(`/user/promotionUserList?areaUserId=${this.$store.state.userInfo.id}&page=${this.page}&key=${this.searchKey}`)
				.then(res=>{
					if(res.code == 0){
						this.total = res.data.totalElements;
						let data = res.data.content;
						if(data.length>0){
							data.forEach(item=>{
								item.createDate = this.$util.formatTime(item.createDate).split(' ')[0];
								if (item.starExplain == null) {
									item.starIcon = '../../static/images/my/star.png'
								}
								if (item.starExplain == "一星拓展员") {
									item.starIcon = '../../static/images/my/star.png'
								}
								if (item.starExplain == "二星拓展员") {
									item.starIcon = '../../static/images/my/moon.png'
								}
								if (item.starExplain == "三星拓展员") {
									item.starIcon = '../../static/images/my/sun.png'
								}
							})
							this.list = this.list.concat(data);
							this.page++;
							if(this.page > res.data.totalPages - 1){
								this.status = 'noMore';
							}else{
								this.status = 'more';
							}
						}else{
							if(this.page == 0){
								this.noData = true;
							}else{
								this.noData = false;
							}
						}
					}
				})
			}
		},
		onReachBottom: function(){ //触底加载
			if(this.status == 'noMore'){
				return
			}
			this.getList();
		},
		onLoad:function(){
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		min-height: 100vh;
	}
	.top{
		width: 100%;
		height: 50px;
		padding: 0 20rpx;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		.search{
			width: 50%;
			height: 60rpx;
			border-radius: 30rpx;
			background: #E6E6E6;
			padding: 0 10rpx;
			input{
				width: 90%;
				background: #E6E6E6;
				font-size: 28rpx;
				line-height: 28rpx;
				color: #333;
				padding: 0;
			}
			image{
				width: 26rpx;
				display: block;
				margin-right: 10rpx;
			}
		}
		.fz-12{
			line-height: 24rpx;
			color: #CBCBCB;
		}
		.fz-24{
			line-height: 48rpx;
			color: #FF9D12;
			margin-left: 10rpx;
		}
	}
	.main{
		padding: 0 20rpx;
		padding-top: 50px;
		.item{
			background: #fff;
			border-radius: 8rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			.item-left{
				image{
					width: 90rpx;
					height: 90rpx;
					display: block;
					border-radius: 50%;
				}
			}
			.item-right{
				flex: 1;
				color: #999999;
				margin-left: 20rpx;
				line-height: 40rpx;
				image{
					width: 26rpx;
					display: block;
				}
				.info{
					.fz-14{
						color: #333;
					}
					.fz-12{
						color: #999999;
					}
				}
			}
		}
	}
	.no_data{
		flex-direction: column;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		image{
			width: 180rpx;
			display: block;
		}
		.tip{
			line-height: 40rpx;
			margin-top: 40rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
</style>
