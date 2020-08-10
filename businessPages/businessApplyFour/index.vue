<template>
	<view class="bg">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line active">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line active">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line active">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#fff"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">
						<input type="text" placeholder="请输入10字以内的简称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content ">
						<!-- 所属行业类型选择 -->
						<picker mode="selector" :range="industries" @change="bindChange">
							<view class="flex_between">
								<view>
									<input type="text" v-model="current" disabled placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 让利比率 -->
				<view class="item flex_center">
					<view class="item-name">让利比率</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">
								<input type="text" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">所在地区</view>
					<view class="item-content">
						<input type="text" v-model="current" disabled placeholder="请选择" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center">
					<view class="item-name">详细地址</view>
					<view class="item-content flex_center">
						<image class="location" src="../../static/images/common/location.png" mode="widthFix"></image>
						<input type="text" placeholder="点击前往地图选择" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 营业时间 -->
				<view class="item flex_center">
					<view class="item-name">营业时间</view>
					<view class="item-content flex_center">
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="date" @change="startDateChange">
								<view class="flex_between" :class="{date:start=='开始时间',active:start!=='开始时间'}">{{start}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="date" @change="stopDateChange">
								<view class="flex_between" :class="{date:stop=='结束时间',active:stop!=='结束时间'}">{{stop}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 门头照 -->
				<view class="item flex_center">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="positive">
								<image :src="positive" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item flex_center">
					<view class="item-name">商家相册</view>
					<view class="item-content flex_center fz-12">
						<!-- 反面 -->
						<view class="upload flex_center">
							<view class="pic_list flex_center" v-for="item in picList" :key="item.id">
								<image :src="item.url" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" @click="upload('piclist')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="submit">提交审核</view>
		<!-- 地区选择 -->
		<w-picker
			class="address"
			mode="region" 
			:visible.sync="show" 
			:value="defaultRegion"
			default-type="label"
			@confirm="onConfirm($event,'region')" 
			@cancel="onCancel" 
			ref="region" 
		></w-picker>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				industries:['餐饮','零售批发','网上综合商城'],
				current:'',
				start:'开始时间',
				stop:'结束时间',
				positive:'',
				picList:[],
				show:false,
				defaultRegion:["浙江省","杭州市","滨江区"],
				value:['1','2','3'],
			}
		},
		methods:{ 
			onConfirm($event){
				
			},
			onCancel(){
				this.show = false;
			},
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
						if(type=='piclist'){
							this.picList.push({
								id:this.picList.length,
								url:res.tempFilePaths[0]
							})
						}else{
							this[type] = res.tempFilePaths[0];
						}
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
			},
			submit(){
				let params = {
					area: form.areaChange,
					areaCode: form.areaCode,
					areaCodeAreas: form.areaCodeAreas,
					areaCodeCity: form.areaCodeCity,
					contactAddress: data.address,
					businessLicenseUrl: data.isLicenseUrl, //营业执照
					foodbusinessLicenseUrl: data.isFoodstuffUrl, //食品许可证
					id: form.id, //商户id 修改时候再传
					idCardFrontUrl: data.idCardZ, //身份证正面照片
					idCardNumber: form.cardNo, //身份证号码
					idCardReverseUrl: data.idCardF, //身份证反面照片
					tobaccoBusinessLicenseUrl: data.isTobaccoUrl, //烟草许可证
					latitude: data.latitude, //维度
					longitude: data.longitude, //精度
					legalName: form.legalPersonName, //法人姓名
					phone: form.businessPhone, //电话
					profits: form.proportion, //让利比例 
					shopBusinessId: data.cardTypeId, //行业id
					shopBusinessName: data.cardsNameDisplay, //行业名称
					shopImageUrl: shopImageUrl, //商家相册最大20
					shopName: form.businessName, //商家名称
					shopNickName: form.businessBrief, //商家简称
					shopStartTime: data.startTime, //开始时间
					shopStopTime: data.endTime, //结束时间
					shopUrl: data.doorHeaderUrl, //门头照
					userId: app.data.userInfo.userId,
					page: 'pages/payAbout/payIndex/payIndex',
					width: 800
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		padding-bottom: 30rpx;
	}
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
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						color: #333;
						height: 28rpx;
						line-height: 28rpx;
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
						// flex-direction: column;
						justify-content: flex-start;
						color: #CBCBCB;
						// margin-right: 30rpx;
						line-height: 24rpx;
						flex-wrap: wrap;
						.pic_list{
							margin-right: 20rpx;
							margin-bottom: 10rpx;
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
						}
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							// margin-bottom: 10rpx;
						}
						.uploadPic{
							width: 120rpx;
							height: 120rpx;
							// margin-bottom: 10rpx;
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
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		margin: 0 auto;
		margin-top: 30rpx;
	}
</style>
