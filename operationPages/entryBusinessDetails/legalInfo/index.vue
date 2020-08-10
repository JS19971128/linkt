<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 法人姓名 -->
			<view class="item flex_center">
				<view class="item-name">法人姓名</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入法人姓名" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 证件类型 -->
			<view class="item flex_center">
				<view class="item-name">证件类型</view>
				<view class="item-content ">
					<!-- 证件类型选择 -->
					<picker mode="selector" :range="certificates" @change="bindChange">
						<view class="flex_between">
							<view>{{current}}</view>
							<view>
								<image class="more" src="../../../static/images/common/xiala.png" mode="widthFix"></image>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<!-- 身份证号 -->
			<view class="item flex_center">
				<view class="item-name">身份证号</view>
				<view class="item-content">
					<input class="frame" type="text" placeholder="请输入法人18位身份证号码" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
			</view>
			<!-- 身份证照 -->
			<view class="item flex_center">
				<view class="item-name">身份证照</view>
				<view class="item-content flex_center fz-12">
					<view class="upload flex_center">
						<!-- 正面 -->
						<view class="uploadPic flex_center" v-if="positive">
							<image class="pic" :src="positive" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="upload('positive')">
							<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
						<view>正面</view>
					</view>
					<!-- 反面 -->
					<view class="upload flex_center">
						<view class="uploadPic flex_center" v-if="opposite">
							<image class="pic" :src="opposite" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="upload('opposite')">
							<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
						<view>反面</view>
					</view>
					<!-- 手持证件照 -->
					<view class="upload flex_center">
						<view class="uploadPic flex_center" v-if="handHold">
							<image class="pic" :src="handHold" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="upload('handHold')">
							<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
						<view>手持证件照</view>
					</view>
				</view>
			</view>
			<!-- 有效期 -->
			<view class="item flex_center">
				<view class="item-name">有效期</view>
				<view class="item-content flex_center">
					<view class="">
						<!-- 有效期选择 -->
						<picker mode="date" @change="startDateChange">
							<view class="flex_between" :class="{date:start=='yyyymmdd',active:start!=='yyyymmdd'}">{{start}}</view>
						</picker>
					</view>
					<view class="line">—</view>
					<view class="">
						<!-- 有效期选择 -->
						<picker mode="date" @change="stopDateChange">
							<view class="flex_between" :class="{date:stop=='yyyymmdd',active:stop!=='yyyymmdd'}">{{stop}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">查询并更新</view>
	</view>
</template>

<script>
	export default{
		name:'legalInfo',
		props:["show"],
		data() {
			return {
				certificates:['身份证','护照','驾驶证'],
				current:'身份证',
				start:'yyyymmdd',
				stop:'yyyymmdd',
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
				this.current = this.certificates[$event.detail.value]
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
			// 选择起始日期
			startDateChange($event){
				this.start = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.stop = $event.detail.value;
			}
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
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
