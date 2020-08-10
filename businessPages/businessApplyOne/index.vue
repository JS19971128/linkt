<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">法人信息</view>
			<view class="main">
				<!-- 法人姓名 -->
				<view class="item flex_center">
					<view class="item-name">法人姓名</view>
					<view class="item-content">
						<input type="text" placeholder="请输入法人姓名" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件类型 -->
				<view class="item flex_center">
					<view class="item-name">证件类型</view>
					<view class="item-content ">
						<!-- 证件类型选择 -->
						<picker mode="selector" :range="certificates" @change="bindChange">
							<view class="flex_between">
								<view>
									<input type="text" placeholder="请选择证件类型" :disabled="!current" v-model="current" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 证件号码 -->
				<view class="item flex_center">
					<view class="item-name">证件号码</view>
					<view class="item-content">
						<input type="text" placeholder="请输入证件号码" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件照 -->
				<view class="item flex_center">
					<view class="item-name">证件照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="positive" @click="upload('positive')">
								<image :src="positive" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>正面</view>
						</view>
						<!-- 反面 -->
						<view class="upload flex_center">
							<view class="uploadPic flex_center" v-if="opposite" @click="upload('opposite')">
								<image :src="opposite" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('opposite')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>反面</view>
						</view>
						<!-- 手持证件照 -->
						<view class="upload flex_center">
							<view class="uploadPic flex_center" v-if="handHold" @click="upload('handHold')">
								<image :src="handHold" mode="aspectFit"></image>
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
		</view>
		<view class="btn fz-14 flex_center">下一步</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				certificates:['身份证','护照','驾驶证'],
				current:'',
				start:'yyyymmdd',
				stop:'yyyymmdd',
				positive:'',
				opposite:'',
				handHold:'',
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
						// console.log(res)
						let file = res.tempFilePaths[0];
						uni.getFileInfo({
							filePath:file,
							success: (res) => {
								if(res.size < 5000){
									uni.showToast({
										title:'请上传不小于5KB的图片'
									})
								}else{
									uni.uploadFile({
										url: `${this.$store.state.baseUrl}/upload/?serviceType=user`,
										filePath: file,
										fileType: 'image',
										name:' file',
										success:res=>{
											let url = JSON.parse(res.data).data;
											this[type] = url.replace('http','https');
										}
									})
								}
							}
						})
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
	.top{
		padding: 50rpx 0;
		background: #fff;
		border-top: 2rpx solid #D3D3D3;
	}
	.step{
		width: 590rpx;
		margin: 0 auto;
		justify-content: flex-start;
		line-height: 50rpx;
		color: #999999;
		.line{
			height: 90rpx;
			vertical-align: center;
		}
		.step-item{
			flex-direction: column;
			.num{
				width: 90rpx;
				height: 90rpx;
				border: 2rpx solid #999999;
				border-radius: 50%;
				background: #fff;
			}
		}
		.active{
			color: #FF9D11;
			.num{
				border: 2rpx solid #FF9D11;
				background: #FF9D11;
				color: #fff;
			}
		}
	}
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
					input{
						width: 90%;
						padding: 0;
						font-size: 28rpx;
						line-height: 28rpx;
						color: #333;
					}
					image{
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
							image{
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
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
