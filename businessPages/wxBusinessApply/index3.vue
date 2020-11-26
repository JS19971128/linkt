<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index')">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index2')">
					<view class="num flex_center">2</view>
					<view class="">商家信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center">
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
			<view class="title">银行信息</view>
			<view class="main">
				<!-- 账户类型 -->
				<view class="item flex_center">
					<view class="item-name">账户类型</view>
					<view class="item-content">
						<picker mode="selector" :range="zhlx" :value="bank.zhlxIndex" range-key="label" @change="bindTypeChange($event,'zhlx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="bank.zhlxLabel" disabled placeholder="请选择账户类型" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 开户银行 -->
				<view class="item flex_center">
					<view class="item-name">开户银行</view>
					<view class="item-content">
						<picker mode="selector" @change="bindTypeChange($event,'khyh')" :value="bank.khyhIndex" :range="bankAccount" range-key="name">
							<view class="flex_between">
								<view>
								<input type="text" v-model="bank.bankName" disabled placeholder="请选择开户银行" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 支行名称 -->
				<view class="item flex_center">
					<view class="item-name">支行名称</view>
					<view class="item-content">
						<input type="text" v-model="bank.bankBranchName" placeholder="请输入支行名称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<view class="item flex_center" v-if="bank.zhlxLabel === '个人账户'">
					<view class="item-name">银行卡照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center" v-for="(item,index) in imgArr" :key="index">
							<!-- 正面 -->
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
				<!-- 银行地址 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">银行地址</view>
					<view class="item-content">
						<input type="text" v-model="bank.baneArea" disabled placeholder="请选择开户银行所在省市" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 银行卡号 -->
				<view class="item flex_center">
					<view class="item-name">银行卡号</view>
					<view class="item-content">
						<input type="number" v-model="bank.cardNo" placeholder="请输入银行卡号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 预留手机号 -->
				<view class="item flex_center">
					<view class="item-name">预留手机号</view>
					<view class="item-content">
						<input type="number" v-model="bank.mobile" placeholder="请输入预留手机号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">下一步</view>
		<w-picker
			class="address"
			mode="region" 
			:visible.sync="show" 
			:value="bank.baneDefaultRegion"
			:hideArea="true"
			default-type="label"
			@confirm="onConfirm($event,'region')" 
			@cancel="onCancel" 
			ref="region" 
		></w-picker>
	</view>
	
</template>

<script>
	import codeNum from '@/common/util/bank_number.js'
	export default{
		data() {
			return {
				zhlx:[{label:'对公账户',type:'TOPUBLIC'},{label:'个人账户',type:'TOPRIVATE'}],
				zhlxLabel:'',
				zhlxIndex:0,
				
				bankAccount:[],
				
				settleBankType:'',
				bankName:'',
				bankUnit:'',
				bankCode:'',
				accountNo:'',
				
				show:false
			}
		},
		computed:{
			merchantCredential(){
				return this.$store.state.shop.merchantCredential
			},
			bank(){
				return this.$store.state.shop.bank
			},
			imgArr(){
				let arr = [];
				let obj = {
					bankCardFrontPic:true,
					bankCardBackPic:true,
				};
				for(let i of this.$store.state.shop.merchantCredential){
					if(obj[i.credentialType]){
						arr.push(i)
					}
				}
				return arr;
			},
		},
		methods:{ 
			onConfirm($event){ //省市区选择
				console.log($event)
				this.bank.baneArea = $event.obj.province.label + ' ' + $event.obj.city.label;
			},
			onCancel(){
				this.show = false;
			},
			// 选择证件类型
			bindTypeChange($event,type){
				if(type === 'zhlx'){
					this.bank.zhlxLabel = this.zhlx[$event.detail.value].label;
					this.bank.settleBankType = this.zhlx[$event.detail.value].type;
					this.bank.zhlxIndex = $event.detail.value;
				}else if(type === 'khyh'){
					this.bank.bankName = this.bankAccount[$event.detail.value].name;
					this.bank.bankUnit = this.bankAccount[$event.detail.value].code;
					this.bank.khyhIndex = $event.detail.value;
				}
				
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
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
			next(){
				const {bank,imgArr,merchantCredential} = this;
				let data = {
					...bank,
					provinceName:bank.baneDefaultRegion[0],
					cityName:bank.baneDefaultRegion[1]
				};
				console.log(data)
				for(let i in data){
					if(data[i]===''){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				if(bank.zhlxLabel === '个人账户'){
					
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
					this.$store.commit('SETMERCHANTCREDENTIAL',merchantCredential);
				}
				this.$store.commit('SETBANK',data);
				uni.redirectTo({
					url:"/businessPages/wxBusinessApply/index4"
				})
			}
		},
		created() {
		},
		onLoad() {
			this.bankAccount = codeNum;
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
		z-index: 99;
	}
</style>
