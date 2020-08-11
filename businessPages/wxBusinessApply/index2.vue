<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index')">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index3')">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index4')">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">企业信息</view>
			<view class="main">
				<!-- 经营类型 -->
				<view class="item flex_center">
					<view class="item-name">经营类型</view>
					<view class="item-content ">
						<!-- 经营类型选择 -->
						<picker mode="selector" :range="jylx" range-key="label" @change="bindTypeChange($event,'jylx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="jylxLabel" disabled placeholder="请选择商户的经营类型" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 经营类目 -->
				<view class="item flex_center">
					<view class="item-name">经营类目</view>
					<view class="item-content ">
						<!-- 经营类目选择 -->
						<picker mode="selector" :range="jylm" range-key="label" @change="bindTypeChange($event,'jylm')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="jylmLabel" disabled placeholder="请选择经营类目与行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 商家名称 -->
				<view class="item flex_center">
					<view class="item-name">商家名称</view>
					<view class="item-content">
						<input type="text" v-model="signName" placeholder="必须与营业执照上的名称一致" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">
						<input type="text" v-model="showName" placeholder="请输入10个字以内的简称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 注册号 -->
				<view class="item flex_center">
					<view class="item-name">注册号</view>
					<view class="item-content">
						<input type="text" v-model="businessLicense" placeholder="请输入营业执照上的注册号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 经营资质 -->
				<view class="item flex_center">
					<view class="item-name">经营资质</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center" v-for="(item,index) in imgArr" :key="index">
							<view class="uploadPic flex_center" v-if="item.credentialUrl" @click="upload(index,'credentialUrl')">
								<image :src="item.credentialUrl" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload(index,'credentialUrl')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 经营期限 -->
				<view class="item flex_center">
					<view class="item-name">经营期限</view>
					<view class="item-content ">
						<!-- 经营类型选择 -->
						<picker mode="selector" :range="jyqx" range-key="label" @change="bindTypeChange($event,'jyqx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="jyqxLabel" disabled placeholder="请选择经营期限" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 起始时间 -->
				<view class="item flex_center">
					<view class="item-name">起始时间</view>
					<view class="item-content">
						<picker mode="date" @change="startDateChange">
							<view class="flex_between" :class="{date:businessDateStart=='请选择营业执照上的经营起始时间',active:businessDateStart!=='请选择营业执照上的经营起始时间'}">{{businessDateStart}}</view>
						</picker>
					</view>
				</view>
				<!-- 期限时间 -->
				<view class="item flex_center" v-if="jyqxLabel!=='长期'">
					<view class="item-name">期限时间</view>
					<view class="item-content">
						<picker mode="date" @change="stopDateChange">
							<view class="flex_between" :class="{date:businessDateLimit=='请选择营业执照上的经营期限时间',active:businessDateLimit!=='请选择营业执照上的经营期限时间'}">{{businessDateLimit}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">保存并下一步</view>
	</view>
</template>

<script>
	import jylm from '@/common/util/wx_jylm.js'
	export default{
		data() {
			return {
				jylx:[{label:'个体户',type:'INDIVIDUALBISS'},{label:'企业',type:'ENTERPRISE'}],
				jylxLabel:'',
				MerchantType:'',
				
				jylm:[],
				jylmLabel:'',
				MerchantCategory:'',
				
				jyqx:[{label:'长期'},{label:'短期'}],
				jyqxLabel:'',
				
				signName:'',
				showName:'',
				businessLicense:'',
				businessDateStart:'请选择营业执照上的经营起始时间',
				businessDateLimit:'请选择营业执照上的经营期限时间'
			}
		},
		computed:{
			imgArr(){
				let arr = [];
				let obj = {
					BUSINESS_LICENSE:true,
					PERMIT_FOR_BANK_ACCOUNT:true
				};
				for(let i of this.$store.state.shop.merchantCredential){
					if(obj[i.credentialType]){
						arr.push(i)
					}
				}
				return arr;
			},
			merchantCredential(){
				return this.$store.state.shop.merchantCredential
			}
		},
		methods:{ 
			bindTypeChange($event,type){
				if(type==='jylx'){
					this.jylxLabel = this.jylx[$event.detail.value].label;
					this.MerchantType = this.jylx[$event.detail.value].type;
				}else if(type==='jylm'){
					this.jylmLabel = this.jylm[$event.detail.value].label;
					this.MerchantCategory = this.jylm[$event.detail.value].type;
				}else if(type==='jyqx'){
					this.jyqxLabel = this.jyqx[$event.detail.value].label
				}
			},
			// 选择起始日期
			startDateChange($event){
				this.businessDateStart = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.businessDateLimit = $event.detail.value;
			},
			// 上传证件照
			upload(index,type){
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
											this.imgArr[index][type] = url.replace('http','https');
										}
									})
								}
							}
						})
					}
				})
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
			},
			next(){
				const {MerchantType,MerchantCategory,jyqxLabel,signName,showName,businessLicense,businessDateStart,businessDateLimit,imgArr,merchantCredential} = this;
				let data = {
					merchantType:MerchantType,
					merchantCategory:MerchantCategory,
					jyqxLabel,
					signName,
					showName,
					businessLicense,
					businessDateStart
				}
				if(jyqxLabel!=='长期'){
					data.businessDateLimit = businessDateLimit;
				}
				
				for(let i in data){
					if(!data[i]){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				for(let i of imgArr){
					if(!i.credentialUrl){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				
				for(let i of imgArr){
					for(let j of merchantCredential){
						if(i.credentialType===j.credentialType){
							j.credentialUrl = i.credentialUrl;
						}
					}
				}
				
				this.$store.commit('SETENTERPRISE',data);
				this.$store.commit('SETMERCHANTCREDENTIAL',merchantCredential);
				
				console.log(merchantCredential,data)
				uni.navigateTo({
					url:"/businessPages/wxBusinessApply/index3"
				})
			}
		},
		onLoad() {
			this.jylm = jylm
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding-bottom: 130rpx;
		box-sizing: border-box;
		min-height: 100vh;
		height: auto;
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
					input{
						width: 90%;
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
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
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
		z-index: 999;
	}
</style>
