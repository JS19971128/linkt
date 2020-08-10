<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 开户银行 -->
			<view class="item flex_center">
				<view class="item-name">开户银行</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请选择对公账户开户银行" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 银行全称 -->
			<view class="item flex_center">
				<view class="item-name">银行全称</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入开户银行全称（含支行）" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 银行地址 -->
			<view class="item flex_center">
				<view class="item-name">银行地址</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请选择开户银行所在省" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 对公账户 -->
			<view class="item flex_center">
				<view class="item-name">对公账户</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入对公账户号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">查询并更新</view>
	</view>
</template>

<script>
	export default{
		name:'bankInfo',
		props:["show"],
		data() {
			return {
				industries:['餐饮','零售批发','网上综合商城'],
				current:'',
				positive:'',
				opposite:'',
				handHold:'',
			}
		},
		computed:{
			ifShow(){
				return this.show;
			}
		},
		methods:{
			// 选择证件类型
			bindChange($event){
				this.current = this.industries[$event.detail.value]
			},
			// 上传证件照
			upload(type){
				uni.chooseImage({
					count:1,
					success: res => {
						console.log(res)
						this[type] = res.tempFilePaths[0];
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		line-height: 28rpx;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 30rpx 20rpx;
				// height: 100rpx;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 20%;
				}
				.item-content{
					justify-content: flex-start;
					color: #333;
					width: 80%;
					.frame{
						width: 90%;
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
					}
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
