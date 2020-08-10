<template>
	<view class="container">
		<view class="top flex_between">
			<view class="search flex_center">
				<view><image src="../../static/images/common/search.png" mode="widthFix"></image></view>
				<input type="text" v-model="searchKey" placeholder="请输入要搜索的内容" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx" confirm-type="search" @confirm="search"/>
			</view>
			<view><text class="fz-12">好友总数</text><text class="fz-24">{{total}}</text></view>
		</view>
		<view class="main" v-if="list.length>0">
			<view class="item flex_between" v-for="item in list" :key="item.id">
				<view class="item-left flex_center">
					<!-- 支付宝头像 -->
					<!-- #ifdef MP-ALIPAY -->
					<view><image :src="item.aliAvatar || '../../static/images/my/avatar.png'" mode="widthFix"></image></view>
					<!-- #endif -->
					<!-- 微信头像 -->
					<!-- #ifdef MP-WEIXIN -->
					<view><image :src="item.wechatHeadImg || '../../static/images/my/avatar.png'" mode="widthFix"></image></view>
					<!-- #endif -->
					<view class="info">
						<!-- 支付宝名称 -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="fz-14" v-if="item.aliNickName">{{item.aliNickName}}</view>
						<!-- #endif -->
						<!-- 微信名称 -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="fz-14">{{item.username}}</view>
						<!-- #endif -->
						<view class="fz-12">UID:{{item.uid}}</view>
					</view>
				</view>
				<view class="item-right fz-12">{{item.createDate}}</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		<view class="no_data" v-else>
			<image src="../../static/images/my/friend_none.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">暂无好友</view>
				<view class="fz-12">您还没有好友呢~</view>
			</view>
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
				searchKey: '',
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods:{
			search(){
				this.page = 0;
				this.list = [];
				this.getList();
			},
			getList(){
				this.status = 'loading';
				this.$fly.get(`/user/myFriends?parentId=${this.userInfo.id}&page=${this.page}&key=${this.searchKey}`)
				.then(res=>{
					if(res.code == 0){
						let data = res.data.friendsPage;
						data.content.forEach(item=>{
							item.createDate = this.$util.formatTime(item.createDate,'yyyy-MM-dd');
						})
						this.total = data.totalElements;
						this.list = this.list.concat(data.content);
						this.page++;
						if(this.page > data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}
				})
			}
		},
		onLoad:function(){
			this.getList();
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		overflow: scroll;
		height: auto;
		min-height: 100vh;
	}
	.top{
		width: 100%;
		height: 100rpx;
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
			overflow: hidden;
			input{
				width: 80%;
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
		padding-top: 100rpx;
		.item{
			background: #fff;
			// align-items: flex-start;
			border-radius: 8rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			.item-left{
				image{
					width: 90rpx;
					display: block;
					border-radius: 45rpx;
				}
				.info{
					margin-left: 10rpx;
					line-height: 40rpx;
					.fz-14{
						color: #333;
					}
					.fz-12{
						color: #999999;
					}
				}
			}
			.item-right{
				line-height: 24rpx;
				color: #999999;
			}
		}
	}
	.no_data{
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
 