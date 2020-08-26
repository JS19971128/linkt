<template>
	<view class="container">
		<view class="top flex_between">
			<view class="search flex_center">
				<view><image src="../../static/images/common/search.png" mode="widthFix"></image></view>
				<input type="text" v-model="searchKey" confirm-type="search" @confirm="search" placeholder="请输入商户号" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
			</view>
			<view><text class="fz-12">进件总数</text><text class="fz-24">{{total}}</text></view>
		</view>
		<!-- 后期加上这个统计后需要修改scroll-view高度 -->
		<!-- <view class="flex_center status">
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">审核通过</view>
			</view>
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">待审核</view>
			</view>
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">驳回</view>
			</view>
		</view> -->
		<view class="tab flex_center fz-14">
			<view class="item flex_center" :class="{active:current == item.value}" v-for="item in tab" :key="item.id" @click="changeTab(item.value)">{{item.text}}</view>
		</view>
		<scroll-view scroll-y="true" class="list" @scrolltolower="reachBottom">
			<view class="item flex_between" v-for="item in list" :key="item.id" @click="goCheck(item.userId)">
				<view class="info flex_center">
					<image class="merchant_pic" :src="item.businessLicenseUrl" mode="aspectFill"></image>
					<view class="shop">
						<view class="fz-14">{{item.signName}}</view>
						<view class="fz-12">{{item.createDate}}</view>
					</view>
				</view>
				<!-- <view class="fz-12" :class="{normal:item.status=='normal',audit:item.status=='audit',audit_fail:item.status=='audit_failtrue'}">{{item.status=='normal'?'审核通过':(item.status=='audit'?'待审核':'驳回')}}</view> -->
				<view class="fz-12" :style="{color:item.status&&statusFun(item.status).color}">{{item.status&&statusFun(item.status).name}}</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</scroll-view>
		
		<!-- <view class="no_data flex_center" v-else>
			<image src="../../static/images/operation/merchant_none.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">暂无商家</view>
				<view class="fz-12">您的区域还没有商家呢~</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import {formateObjToParamStr,formatTime} from '@/common/util/util.js'
	export default{
		data() {
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				current:'',
				tab:[
					{id:1,text:'全部',value:''},
					{id:2,text:'已通过',value:'PASS'},
					{id:3,text:'已驳回',value:'FAILED'},
					{id:4,text:'待审核',value:'AUDITED'},
					{id:5,text:'已完成',value:'FINISH'},
				],
				page:0,
				list:[],
				total:0,
				searchKey:'',
				statusArr: [{
						name: '待审核',
						type: 'AUDITED',
						color:'#6e9a02'
					},
					{
						name: '已通过',
						type: 'PASS',
						color:'#5cbe88'
					},
					{
						name: '已完成',
						type: 'FINISH',
						color:'#999999'
					},
					{
						name: '未通过',
						type: 'FAILED',
						color:'#ce1212'
					}
				],
			}
		},
		methods:{
			statusFun(status){
				for(let i of this.statusArr){
					if(i.type === status){
						return i;
					}
				}
				return {
						name: '未通过',
						type: 'FAILED',
						color:'#ce1212'
					}
			},
			changeTab(value){ //改变选中
				this.current = value;
				this.list = [];
				this.page = 0;
				this.getList();
			},
			search(){  //搜索
				this.list = [];
				this.page = 0;
				this.getList();
			},
			getList(){ //获取进件商家列表
				this.status = 'loading';
				let data = {
					page:this.page,
					size:10,
					merchantNo:this.searchKey,
					status:this.current,
				}
				this.$fly.post(`/entry/queryMerchantEntryList?${formateObjToParamStr(data)}`)
				.then(res=>{
					uni.stopPullDownRefresh();
					if(res.code == 0){
						if(!this.current){
							this.total = res.data.totalElements;
						}
						let data = res.data.content;
						data.forEach(item=>{
							item.createDate = formatTime(item.createDate)
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
				.catch(err=>{
					
				})
			},
			goCheck(id){ //进件审核
				uni.navigateTo({
					url:`/operationPages/entryBusinessDetails/index?id=${id}`
				})
			},
			reachBottom(){ //触底加载
				if(this.status == 'noMore'){
					return
				}
				this.getList();
			},
		},
		onLoad:function(){
			this.getList();
		},
		onPullDownRefresh:function(){ //下拉刷新
			this.current = '';
			this.list = [];
			this.page = 0;
			this.getList();
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
		.search{
			width: 50%;
			height: 60rpx;
			border-radius: 30rpx;
			background: #E6E6E6;
			padding: 0 10rpx;
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
	.status{
		color: #333;
		line-height: 40rpx;
		padding: 10rpx 0;
		border-top: 2rpx solid #D3D3D3;
		background: #fff;
		>view{
			flex: 1;
			text-align: center;
			border-right: 2rpx solid #DEDEDE;
			&:nth-child(3){
				border: 0;
			}
			.fz-12{
				color: #999999;
			}
		}
	}
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
	.list{
		height: 80vh;
		padding: 0 20rpx;
		box-sizing: border-box;
		.item{
			padding: 20rpx;
			line-height: 40rpx;
			background: #fff;
			border-radius: 8rpx;
			box-shadow: 0 0 20rpx 2rpx rgba(0,0,0,.1);
			margin-bottom: 20rpx;
			.info{
				width: 78%;
				justify-content: flex-start;
				.shop{
					.fz-14{
						width: 400rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.merchant_pic{
					width: 90rpx;
					height: 90rpx;
					display: block;
					margin-right: 20rpx;
					border-radius: 4rpx;
				}
			}
			
			.normal{
				color: #47D347;
			}
			.audit{
				color: #FFBC65;
			}
			.audit_fail{
				color: #F04141;
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
