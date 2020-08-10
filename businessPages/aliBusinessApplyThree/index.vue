<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">联系信息</view>
				</view>
				<view class="line active-line"></view>
				<view class="step-item active flex_center">
					<view class="num flex_center">2</view>
					<view class="">资料补充</view>
				</view>
				<view class="line active-line"></view>
				<view class="step-item active flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#fff"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content flex_center">
						<input type="text" v-model="nickname" placeholder="请输入10字以内的简称" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content">
						<!-- 所属行业类型选择 -->
						<picker mode="selector" :range="industryList" :range-key="'name'" :value="index" @change="bindChange">
							<view class="flex_between">
								<view class="flex_center industry">
									<input type="text" v-model="current" :disabled="!current" placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
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
					<view class="item-content flex_center">
						<view class="flex_between profit">
							<view class="rate">
								<input type="number" pattern="[0-9]*" v-model="rate" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px" @input="checkRate"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center">
					<view class="item-name">所在地区</view>
					<view class="item-content flex_center">
						<input type="text" v-model="area" disabled placeholder="选择地址后自动录入省市区" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center" @click="goMap">
					<view class="item-name">详细地址</view>
					<view class="item-content flex_center">
						<image class="location" src="../../static/images/common/location.png" mode="widthFix"></image>
						<view class="address" v-if="address">{{address}}</view>
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
								<view class="flex_between" :class="{date:start=='开始时间',active:start!=='开始时间'}">{{start}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="stopDateChange">
								<view class="flex_between" :class="{date:stop=='结束时间',active:stop!=='结束时间'}">{{stop}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item album flex_center">
					<view class="item-name">商家相册</view>
					<view class="item-content flex_center fz-12">
						<!-- 商家相册 -->
						<view class="upload flex_center">
							<view class="pic_list flex_center" v-for="(item,i) in picList" :key="i" @click="previewImg(item)">
								<image :src="item" mode="aspectFill"></image>
								<view class="delete-img flex_center" @click.stop="deleteImg(i)">
									<uni-icons class="flex_center" type="clear" color="#FF1919" :size="18"></uni-icons>
								</view>
							</view>
							<view class="frame flex_center" @click="upload('piclist')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="checkForm">提交审核</view>
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
				nickname:'', //商家简称
				industryList:[], //所属行业list
				current:'', //当前选择行业
				currentId:'', 
				rate:'', //让利比率
				area:'', //所在地区
				provinceCode:'-1',
				cityCode:'-1',
				regionCode:'-1',
				latitude:'',
				longitude:'',
				address:'', //详细地址
				start:'开始时间', //营业开始时间
				stop:'结束时间',  //营业结束时间
				picList:[],  //商家相册
				show:false,  
				defaultRegion:["北京市","北京市","东城区"],
			}
		},
		methods:{ 
			onConfirm($event){
				console.log($event)
				this.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				this.provinceCode = $event.value[0];
				this.cityCode = $event.value[1];
				this.regionCode = $event.value[2];
				this.address = '';
			},
			onCancel(){
				this.show = false;
			},
			// 选择行业类型
			bindChange($event){
				// console.log($event)
				this.current = this.industryList[$event.detail.value]['name'];
				this.currentId = this.industryList[$event.detail.value]['id'];
			},
			// 上传商家相册
			upload(type){
				uni.chooseImage({
					count:1,
					success: res => {
						// console.log(res)
						let file = res.tempFilePaths[0];
						uni.getFileInfo({
							filePath:file,
							success:res=>{
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
											this.picList.push(url.replace('http','https'));
										}
									})
								}
							}
						})
					}
				})
			},
			deleteImg(index){ //删除商家相册照片
				this.picList.splice(index,1);
			},
			previewImg(img){  //商家相册图片预览
				uni.previewImage({
					loop:true,
					current:img,
					urls: this.picList,
					success:res=>{
						console.log(res)
					}
				})
			},
			goMap(){ //导航
				uni.chooseLocation({
					success:res=>{
						console.log(res)
						this.address = res.address;
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${this.$store.state.mapKey}`)
						.then(res=>{
							debugger
							console.log(res)
							let data = res.result.address_component;
							this.area = data.province + ' ' + data.city + ' ' + data.district;
							this.defaultRegion = this.area.split(' ');
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
			},
			getBusinessList(){  //获取行业列表
				this.$fly.get('/ShopBusiness/list')
				.then(res=>{
					if(res.code == 0){
						this.industryList = res.data.content;
					}
				})
			},
			checkRate(){ //检查让利比率
				let reg = /^[1-9]\d*|0$/;
				if(this.rate){
					if(!reg.test(this.rate)){
						uni.showToast({
							title:'请输入有效数字'
						})
						this.rate = '';
					}else if(this.rate < 5 || this.rate > 30){
						uni.showToast({
							title:'请输入5%-30%范围内的让利比率'
						})
						this.rate = '';
					}
				}
			},
			getAliSignInfo(){ //获取支付宝签约信息（已申请过）
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/signProcess/agentQueryByUserId?userId=${this.$store.state.userInfo.id}`)
				.then(res=>{
					uni.hideLoading();
					if(res.code == 0){
						let data = res.data;
						this.$store.state.form = { //支付宝进件数据
							account: data.account, //支付宝账号
							contactName: data.contactName, //联系人名称
							contactMobile: data.contactMobile, //联系人手机号码
							contactEmail: data.contactEmail, //联系人邮箱
							mccCode: data.mccCode, //经营类目编码
							specialLicensePic: data.specialLicensePic, //资质补充
							shopSignBoardPic: data.shopSignBoardPic, //门头照
							businessLicensePic: data.businessLicensePic, //营业执照
							businessLicenseNo: data.businessLicenseNo, //执照号码
							longTerm: data.longTerm,  //营业期限
							dateLimitation: data.dateLimitation,  //期限日期
						}
					}
				})
			},
			checkForm(){ //确认信息填写完整
				if( !this.nickname || !this.current || !this.rate || !this.address || !this.start || !this.stop || !this.picList){
					uni.showToast({
						title:'请填写完整所有信息'
					})
				}else if(this.rate < 5 || this.rate > 30){
					uni.showToast({
						title:'请输入5%-30%范围内的让利比率'
					})
				}else{
					this.submit();
				}
			},
			submit(){ //提交
				let params = {
					authUserId:this.$store.state.userInfo.alipayUserId,
					userId: this.$store.state.userInfo.id,
					shopNickName: this.nickname,
					shopBusinessId: this.currentId,
					shopBusinessName: this.current,
					profits: this.rate,
					contactAddress: this.address,
					shopStartTime: this.start,
					shopStopTime: this.stop,
					shopImageUrl: this.picList.join(','),
					areaCode: this.provinceCode,
					areaCodeCity: this.cityCode,
					areaCodeAreas: this.regionCode,
					area: this.area,
					latitude: this.latitude,
					longitude: this.longitude,
					...this.$store.state.form
				}
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.post(`/signProcess/agentSumit`,params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.redirectTo({
							url:`/businessPages/review/index?status=1`
						})
					}else{
						uni.showToast({
							title: res.message
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
				})
			}
		},
		onLoad:function(){
			this.getBusinessList();  //获取行业列表
			this.getAliSignInfo();  //获取支付宝签约信息（已申请过）
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		// padding-bottom: 30px;
		overflow: scroll;
	}
	.top{
		padding: 50rpx 0;
		background: #fff;
		border-top: 2rpx solid #D3D3D3;
	}
	.step{
		width: 590rpx;
		margin: 0 auto;
		align-items: flex-start;
		line-height: 50rpx;
		color: #999999;
		white-space: nowrap;
		.line{
			width: 200rpx;
			height: 2rpx;
			border-bottom: 2rpx dashed #999;
			margin-top: 45rpx;
		}
		.active-line{
			border-bottom: 2rpx dashed #FF9D11;
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
		line-height: 14px;
		font-size: 14px;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 0 20rpx;
				height: 50px;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 20%;
				}
				.item-content{
					justify-content: flex-start;
					// align-items: flex-start;
					color: #333;
					width: 80%;
					.profit{
						width: 100%;
					}
					.industry{
						justify-content: flex-start;
					}
					.address{
						margin-left: 10rpx;
					}
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						color: #333;
						// height: 30rpx;
						line-height: 14px;
						font-size: 14px;
						padding: 0;
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
							position: relative;
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
							.delete-img{
								width: 18px;
								height: 18px;
								border-radius: 50%;
								background: #fff;
								position: absolute;
								top: -8px;
								right: -8px;
							}
						}
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							margin-bottom: 10rpx;
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
			.album{
				height: unset;
				padding: 15px 20rpx;
			}
		}
	}
	input[disabled],input:disabled,input.disabled{
		color: #333;
		opacity: 1;
		-webkit-text-fill-color:#333;
		-webkit-opacity:1;
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		margin: 30px auto;
		// margin-top: 30px;
	}
</style>
