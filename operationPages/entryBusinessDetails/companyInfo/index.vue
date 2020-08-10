<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 所属行业 -->
			<view class="item flex_center">
				<view class="item-name">所属行业</view>
				<view class="item-content ">
					<!-- 所属行业选择 -->
					<picker mode="selector" :range="industries" @change="bindChange">
						<view class="flex_between">
							<view>
							<input class="frame" type="text" v-model="current" disabled placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
							</view>
							<view>
								<image class="more" src="../../../static/images/common/xiala.png" mode="widthFix"></image>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<!-- 商家名称 -->
			<view class="item flex_center">
				<view class="item-name">商家名称</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="必须与营业执照上的名称一致" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 商家简称 -->
			<view class="item flex_center">
				<view class="item-name">商家简称</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入10个字以内的简称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 客服电话 -->
			<view class="item flex_center">
				<view class="item-name">客服电话</view>
				<view class="item-content">13655558888</view>
			</view>
			<!-- 注册号 -->
			<view class="item flex_center">
				<view class="item-name">注册号</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入营业执照上的注册号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 经营资质 -->
			<view class="item flex_center">
				<view class="item-name">经营资质</view>
				<view class="item-content flex_center fz-12">
					<view class="upload flex_center">
						<!-- 正面 -->
						<view class="uploadPic flex_center" v-if="positive">
							<image class="pic" :src="positive" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="upload('positive')">
							<uni-icons type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
						<view>营业执照</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">查询并更新</view>
	</view>
</template>

<script>
	export default{
		name:'companyInfo',
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
					.more{
						width: 24rpx;
						display: block;
					}
					.line{
						color:#999 ;
						margin: 0 10rpx;
					}
					.date{
						color: #CBCBCB;
					}
					.active{
						color: #333;
					}
					.upload{
						flex-direction: column;
						color: #CBCBCB;
						margin-right: 30rpx;
						line-height: 24rpx;
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							margin-bottom: 10rpx;
						}
						.uploadPic{
							width: 120rpx;
							height: 120rpx;
							margin-bottom: 10rpx;
							.pic{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
						}
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
		margin: 30rpx auto;
		// margin-top: 30rpx 0;
	}
</style>
