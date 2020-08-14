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
						<picker mode="selector" :range="jylx" :value="enterprise.jylxIndex" range-key="label" @change="bindTypeChange($event,'jylx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="enterprise.jylxLabel" disabled placeholder="请选择商户的经营类型" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
						<picker mode="selector" :range="jylm" :value="enterprise.jylmIndex" range-key="label" @change="bindTypeChange($event,'jylm')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="enterprise.jylmLabel" disabled placeholder="请选择经营类目" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
					<view class="item-name">经营行业</view>
					<view class="item-content ">
						<!-- 经营类目选择 -->
						<picker mode="selector" :range="jyhy" :value="enterprise.jyhyIndex" range-key="name" @change="bindTypeChange($event,'jyhy')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="enterprise.jyhyLabel" disabled placeholder="请选择经营行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 地址选择 -->
				<view class="item flex_center">
					<view class="item-name">经营地区</view>
					<view class="item-content">
						<picker-data ref="picker" @regionCodeFun="regionCodeFun"></picker-data>
					</view>
				</view>
				<!-- 商家名称 -->
				<view class="item flex_center">
					<view class="item-name">商家名称</view>
					<view class="item-content">
						<input type="text" v-model="enterprise.signName" placeholder="必须与营业执照上的名称一致" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">
						<input type="text" v-model="enterprise.showName" placeholder="请输入10个字以内的简称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 注册号 -->
				<view class="item flex_center">
					<view class="item-name">注册号</view>
					<view class="item-content">
						<input type="text" v-model="enterprise.businessLicense" placeholder="请输入营业执照上的注册号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
						<picker mode="selector" :range="jyqx" :value="enterprise.jyqxIndex" range-key="label" @change="bindTypeChange($event,'jyqx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="enterprise.jyqxLabel" disabled placeholder="请选择经营期限" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
						<picker mode="date" :value="enterprise.businessDateStart" @change="startDateChange">
							<view class="flex_between" :class="{date:enterprise.businessDateStart=='请选择营业执照上的经营起始时间',active:enterprise.businessDateStart!=='请选择营业执照上的经营起始时间'}">{{enterprise.businessDateStart}}</view>
						</picker>
					</view>
				</view>
				<!-- 期限时间 -->
				<view class="item flex_center" v-if="enterprise.jyqxLabel!=='长期'">
					<view class="item-name">期限时间</view>
					<view class="item-content">
						<picker mode="date" :value="enterprise.businessDateLimit" @change="stopDateChange">
							<view class="flex_between" :class="{date:enterprise.businessDateLimit=='请选择营业执照上的经营期限时间',active:enterprise.businessDateLimit!=='请选择营业执照上的经营期限时间'}">{{enterprise.businessDateLimit}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">保存并下一步</view>
	</view>
</template>

<script>
	import jylm from '@/common/util/wx_jylm.js';
	import pickerData from '@/businessPages/wxBusinessApply/pickerData'
	export default{
		data() {
			return {
				jylx:[{label:'个体户',type:'INDIVIDUALBISS',key:'个体工商户'},{label:'企业',type:'ENTERPRISE',key:'企业'}],
				jylxLabel:'',
				merchantType:'',
				jylxIndex:0,
				jylxKey:'',
				
				jylm:[],
				jylmLabel:'',
				merchantCategory:'',
				jylmIndex:0,
				jylmKey:'',
				
				jyhy:[],
				jyhyIndex:0,
				jyhyLabel:'',
				industryTypeCode:'',
				
				jyqx:[{label:'长期',key:true},{label:'短期',key:false}],
				jyqxLabel:'',
				jyqxIndex:0,
				longTerm:true,
				
				signName:'',
				showName:'',
				businessLicense:'',
				businessDateStart:'请选择营业执照上的经营起始时间',
				businessDateLimit:'请选择营业执照上的经营期限时间',
			}
		},
		components:{
			pickerData
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
			},
			enterprise(){
				return this.$store.state.shop.enterprise;
			}
		},
		methods:{ 
			bindTypeChange($event,type){
				if(type==='jylx'){
					this.enterprise.jylxLabel = this.jylx[$event.detail.value].label;
					this.enterprise.merchantType = this.jylx[$event.detail.value].type;
					this.enterprise.jylxIndex = $event.detail.value;
					this.enterprise.jylxKey = this.jylx[$event.detail.value].key;
					this.categoryName()
				}else if(type==='jylm'){
					this.enterprise.jylmLabel = this.jylm[$event.detail.value].label;
					this.enterprise.merchantCategory = this.jylm[$event.detail.value].type;
					this.enterprise.jylmIndex = $event.detail.value;
					this.enterprise.jylmKey = this.jylm[$event.detail.value].label;
					this.categoryName()
				}else if(type==='jyhy'){
					this.enterprise.jyhyLabel = this.jyhy[$event.detail.value].name;
					this.enterprise.industryTypeCode = this.jyhy[$event.detail.value].id;
					this.enterprise.jyhyIndex = $event.detail.value;
				}else if(type==='jyqx'){
					this.enterprise.jyqxLabel = this.jyqx[$event.detail.value].label
					this.enterprise.jyqxIndex = $event.detail.value;
					this.enterprise.longTerm = this.jyqx[$event.detail.value].key
				}
			},
			jyhyInit(){
				this.enterprise.jyhyLabel
			},
			// 选择起始日期
			startDateChange($event){
				this.enterprise.businessDateStart = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.enterprise.businessDateLimit = $event.detail.value;
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
			//地址选择
			regionCodeFun(e){
				this.enterprise.regionCode = e.regionCode;
				this.enterprise.addressName = e.addressName;
			},
			next(){
				const {enterprise,imgArr,merchantCredential} = this;
				let data = {...enterprise};
				console.log(merchantCredential,data)
				for(let i in data){
					if(!data[i] && i!=='longTerm'){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				for(let i of imgArr){
					if(!i.credentialUrl && i.credentialType!='PERMIT_FOR_BANK_ACCOUNT'){
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
				
				uni.redirectTo({
					url:"/businessPages/wxBusinessApply/index3"
				})
			},
			init(){
				this.$refs.picker.init(this.enterprise.addressName);
				this.jylm = jylm;
				this.categoryName();
			},
			async categoryName(){
				try{
					let {enterprise} = this;
					let {jylxKey,jylmKey} = enterprise
					
					let category = await this.$fly.post(`/entry/getIndustryTypeCodeList?name=${jylxKey}-${jylmKey}`);
					for(let i of category){
						let name = i.name;
						let sl = name.slice(name.indexOf('-')+1);
						i.name = sl.slice(sl.indexOf('-')+1);
					}
					this.jyhy = category;
				}catch(e){
					//TODO handle the exception
					console.error(e)
				}finally{
					
				}
			}
		},
		onLoad() {
			this.init();
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
