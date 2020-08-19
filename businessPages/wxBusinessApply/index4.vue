<template>
	<view class="bg">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index')">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index2')">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index3')">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content ">
						<!-- 所属行业类型选择 -->
						<picker mode="selector" :range="industryList" range-key="name" @change="bindChange">
							<view class="flex_between">
								<view>
									<input type="text" v-model="shopIndex.shopBusinessName" disabled placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
								<input v-model="shopIndex.profits" type="number" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">店铺地址</view>
					<view class="item-content">
						<input type="text" v-model="shopIndex.area" disabled placeholder="请选择店铺地址" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center" @click="goMap">
					<view class="item-name">详细地址</view>
					<view class="item-content flex_center">
						<image class="location" src="../../static/images/common/location.png" mode="widthFix"></image>
						<view class="address" v-if="shopIndex.address">{{shopIndex.address}}</view>
						<view class="flex_center" v-else>
							<input type="text" :disabled="true" placeholder="点击前往地图选择" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
						</view>
					</view>
				</view>
				<!-- 营业时间 -->
				<view class="item flex_center">
					<view class="item-name">营业时间</view>
					<view class="item-content flex_center">
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="startDateChange">
								<view class="flex_between" :class="{date:shopIndex.shopStartTime=='',active:shopIndex.shopStartTime!==''}">{{shopIndex.shopStartTime||'开始时间'}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="stopDateChange">
								<view class="flex_between" :class="{date:shopIndex.shopStopTime=='',active:shopIndex.shopStopTime!==''}">{{shopIndex.shopStopTime||'结束时间'}}</view>
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
							<view class="uploadPic flex_center" v-if="shopIndex.positive" @click="upload('positive')">
								<image :src="shopIndex.positive" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')" >
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item flex_center">
					<view class="item-name">室内照</view>
					<view class="item-content flex_center fz-12">
						<!-- 反面 -->
						<view class="upload" style="flex-direction: column;display: flex;">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="shopIndex.piclist" @click="upload('piclist')">
								<image :src="shopIndex.piclist" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('piclist')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view class="mt10 flex_center">请上传1张门店室内照，才可通过审核喔~</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="service fz-12"><view class="shop-title-check checkbox" :class="{'active':isActive}" @click="txtParentActive()"></view><text>入驻需要勾选以下协议</text><text class="agreement" @click="goService">《商家隐私政策》</text></view>
		<view class="btn fz-14 flex_center bc" @click="submit()">保存</view>
		<view class="btn fz-14 flex_center" @click="submit(true)">提交审核</view>
		<!-- 地区选择 -->
		<w-picker
			class="address"
			mode="region" 
			:visible.sync="show" 
			:value="shopIndex.defaultRegion"
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
				industryList:[],
				show:false,
				isActive:false
			}
		},
		computed:{
			legalPerson(){
				return this.$store.state.shop.legalPerson;
			},
			enterprise(){
				return this.$store.state.shop.enterprise;
			},
			bank(){
				return this.$store.state.shop.bank;
			},
			merchantCredential(){
				return this.$store.state.shop.merchantCredential;
			},
			userId(){
				return this.$store.state.userInfo.id || 22222234;
			},
			shopIndex(){
				return this.$store.state.shop.shopIndex;
			}
		},
		methods:{ 
			onConfirm($event){ //省市区选择
				console.log($event)
				this.shopIndex.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				let adcode = $event.value[2];
				this.shopIndex.areaCode = adcode.substring(0,2);
				this.shopIndex.areaCodeCity = adcode.substring(0,4);
				this.shopIndex.areaCodeAreas = adcode;
			},
			onCancel(){
				this.show = false;
			},
			goMap(){ //导航
				uni.chooseLocation({
					success:res=>{
						console.log(res)
						this.shopIndex.address = res.address;
						this.shopIndex.latitude = res.latitude;
						this.shopIndex.longitude = res.longitude;
					}
				})
			},
			getBusinessList(){  //获取行业列表
				this.$fly.get('/ShopBusiness/list')
				.then(res=>{
					if(res.code == 0){
						this.industryList = res.data.content;
					}
				})
			},
			// 选择证件类型
			bindChange($event){
				this.shopIndex.shopBusinessName = this.industryList[$event.detail.value].name
				this.shopIndex.shopBusinessId = this.industryList[$event.detail.value].id
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
			},
			txtParentActive(){
				this.isActive = !this.isActive;
			},
			goService(){  //进入商家隐私政策
				uni.navigateTo({
					url: '/businessPages/wxBusinessApply/help'
				})
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
											this.shopIndex[type] = url.replace('http','https');
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
				this.shopIndex.shopStartTime = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.shopIndex.shopStopTime = $event.detail.value;
			},
			submit(go){
				
				const {shopIndex} = this;
				let data = {
					...shopIndex,
					contactAddress:shopIndex.address
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
				if(this.shopIndex.profits < 5 || this.shopIndex.profits > 30){
					uni.showToast({
						title:'请输入5%-30%范围内的让利比率',
						icon: 'none'
					})
					return ;
				}
				
				this.$store.commit('SETSHOPINDEX',data);
				if(go){
					let {legalPerson,enterprise,bank,merchantCredential,userId,isActive} = this;
					
					if(!legalPerson.legalPersonID){
						wx.showToast({
						  title:'请完善法人信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
					if(!enterprise.merchantType){
						wx.showToast({
						  title:'请完善企业信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
					if(!bank.bankCode){
						wx.showToast({
						  title:'请完善银行卡信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
					
					if(!isActive){
						wx.showToast({
						  title:'请勾选商家隐私政策！',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
					
					let SIGN_BOARD = false,INTERIOR_PHOTO = false;
					merchantCredential.forEach((i,v)=>{
						if(i.credentialType==='SIGN_BOARD'){
							SIGN_BOARD = true;
						}
						
						if(i.credentialType==='INTERIOR_PHOTO'){
							INTERIOR_PHOTO = true;
						}
						
						if(!i.credentialUrl){
							merchantCredential.splice(v,1); 
						}
					})
					
					if(!SIGN_BOARD){
						merchantCredential.push({
							credentialType:'SIGN_BOARD',
							credentialUrl:shopIndex.positive,
						});
					}
					if(!INTERIOR_PHOTO){
						merchantCredential.push({
							credentialType:'INTERIOR_PHOTO',
							credentialUrl:shopIndex.piclist,
						});
					}
					
				
					
					console.log(data)
					let idCardStartDate = legalPerson.idCardStartDate.split('-');
					let idCardEndDate = legalPerson.idCardEndDate.split('-');
					let businessDateStart = enterprise.businessDateStart.split('-');
					let businessDateLimit = enterprise.businessDateLimit.split('-');
					let prams = {
						...data,
						...legalPerson,
						...enterprise,
						...bank,
						
						idCardStartDate:idCardStartDate.join(''),
						idCardEndDate:idCardEndDate.join(''),
						businessDateStart:businessDateStart.join(''),
						businessDateLimit:businessDateLimit.join(''),
						
						userId,
						appPayType:'WXPAY',
						merchantCredential,
					}
					
					this.stm(prams);
				}else{
					uni.showToast({
					    title: '保存成功！',
					    duration: 2000,
						icon:'none'
					});
				}
			},
			async stm(prams){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let doEntry = await this.$fly.post('/entry/doEntry',prams);
					
					if(doEntry.code!=0){
						uni.showToast({
						    title:doEntry.message,
						    duration: 2000,
							icon:'none'
						});
						return ;
					}
					
					if(doEntry.data.code!=200){
						uni.showToast({
						    title:doEntry.data.msg,
						    duration: 2000,
							icon:'none'
						});
						return ;
					}
					
					if(doEntry.data.data.entryStatus!=='AUDITED'){
						uni.showToast({
						    title:'资料不正确，请填写真实的资料',
						    duration: 2000,
							icon:'none'
						});
						return ;
					}
					
					uni.redirectTo({
						url:'/businessPages/review/index'
					})
				}catch(e){
					uni.showToast({
					    title: '数据异常，请稍后重试！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
				}
			}
		},
		onLoad() {
			this.getBusinessList()
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
		box-sizing: border-box;
		&.bc{
			background: #fff;
			color: #FF9D11;
			border: solid 2rpx #FF9D11;
		}
	}
	.service{
		line-height: 32rpx;
		text-align: center;
		margin-top: 30rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		color: #999999;
		align-content: center;
		justify-content: center;

		.agreement{
			color: #50A9E6;
		}
	}
	.checkbox{
		width:32rpx;
		height:32rpx;
		border:2rpx solid rgba(204, 204, 204, 1);
		border-radius:50%;
		margin-right: 20rpx;
		&.active{
			background: #FFAD5D;
			position: relative;
			border-color:#FFAD5D ;
			&::before{
				content: "";
				position: absolute;
				background: url(../../static/images/shop/check.png) no-repeat;
				background-size: 16rpx 16rpx;
				width: 16rpx;
				height: 16rpx;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}
	.mt10{
		margin-top: 20rpx;
	}
</style>
