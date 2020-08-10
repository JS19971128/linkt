<template>
	<view class="container">
		<view class="top flex_between">
			<view class="search flex_center">
				<view><image src="../../static/images/common/search.png" mode="widthFix"></image></view>
				<view><input type="text" placeholder="请输入要搜索的内容" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx" @confirm="search"/></view>
			</view>
			<view><text class="fz-12">客户总数</text><text class="fz-24">{{total}}</text></view>
		</view>
		<view class="main" v-if="list.length>0">
			<view class="item flex_between" v-for="item in list" :key="item.id">
				<view class="item-left flex_center">
					<!-- 支付宝头像 -->
					<!-- #ifdef MP-ALIPAY -->
					<view><image :src="item.aliHeadImg || '../../static/images/my/avatar.png'" mode="widthFix"></image></view>
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
				<view class="fz-14">暂无客户</view>
				<view class="fz-12">您还没有客户呢~</view>
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
				merachatId:'',
			}
		},
		methods:{
			search(){ //搜索
				this.page = 0;
				this.list = [];
				this.getList(this.merachatId);
			},
			getList(id){ //获取客户列表
				this.status = 'loading';
				this.$fly.get(`/merchatCustom/list?merachatId=${id}&page=${this.page}&key=${this.searchKey}`)
				.then(res=>{
					if(res.code == 0){
						let data = res.data;
						data.content.forEach(item=>{
							item.createDate = this.$util.formatTime(item.createDate,'yyyy-MM-dd');
						})
						this.list = this.list.concat(data.content);
						this.total = res.data.totalElements;
						this.page++;
						if(this.page > data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}else{
						this.status = 'noMore';
					}
				})
				.catch(err=>{
					this.status = 'noMore';
				})
			}
		},
		onLoad:function(query){
			this.merachatId = query.id;
			// 获取客户列表
			this.getList(query.id);
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		height: 100rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		.search{
			width: 60%;
			height: 60rpx; 
			border-radius: 30rpx;
			background: #E6E6E6;
			padding: 0 10rpx;
			input{
				width: 88%;
				background: #E6E6E6;
				padding: 0;
				font-size: 28rpx;
				line-height: 28rpx;
				color: #333;
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
