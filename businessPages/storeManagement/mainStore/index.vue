<template>
	<view v-show="ifShow">
		<!-- 主店信息 -->
		<view class="info fz-14">
			<view class="main">
				<!-- 商家名称 -->
				<view class="item flex_center">
					<view class="item-name">商家名称</view>
					<view class="item-content">
						<input class="frame" type="text" v-model="shopName" placeholder="请输入全称" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">
						<input class="frame" type="text" v-model="nickname" placeholder="请输入10字以内的简称" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 让利比率 -->
				<view class="item flex_center">
					<view class="item-name">让利比率</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">
								<input class="frame" type="number" v-model="rate" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px" @input="checkRate"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 联系电话 -->
				<view class="item flex_center">
					<view class="item-name">联系电话</view>
					<view class="item-content">
						<input class="frame" type="text" v-model="phone" placeholder="请输入座机号或者手机号码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center">
					<view class="item-name">所在地区</view>
					<view class="item-content">
						<input type="text" placeholder="请选择您的地区"  v-model="area" disabled="true" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
						<!-- <input class="frame" type="text" v-model="area" disabled placeholder="选择地址后自动录入省市区" placeholder-style="color:#CBCBCB;font-size:28rpx"/> -->
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center" @click="goMap">
					<view class="item-name">详细地址</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="address" v-if="address">{{address}}</view>
							<view class="flex_center" v-else>
								<input type="text" :disabled="true" placeholder="点击前往地图选择" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
							</view>
							<view>
								<image class="more" src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
							</view>
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
				<!-- 门头照 -->
				<view class="item flex_center album">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 门头照 -->
							<view class="uploadPic flex_center" v-if="positive" @click="upload('positive')">
								<image class="pic" :src="positive" mode="aspectFill"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item flex_center album">
					<view class="item-name">商家相册</view>
					<view class="item-content flex_center fz-12">
						<!-- 商家相册 -->
						<view class="upload flex_center">
							<view class="pic_list flex_center" v-for="(item,i) in picList" :key="i" @click="previewImg(item)">
								<image class="pic" :src="item" mode="aspectFill"></image>
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
				<!-- 语音播报 -->
				<view class="item flex_center">
					<view class="item-name">语音播报</view>
					<view class="item-content">
						<switch :checked="isOpenVoice" @change="switch1Change" />
					</view>
				</view>
				<!-- 语音播报 -->
				<view class="item flex_center" @click="checkUrl('/businessPages/storeManagement/voice')">
					<view class="item-name">语音音箱</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="address"></view>
							<view class="flex_center">
								<uni-icons v-if="deviceName" class="flex_center" type="checkbox-filled" color="#47D347" :size="20"></uni-icons>
								<image class="more" src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="checkForm">保存修改</view>
		<!-- 地区选择 -->
		<w-picker
			class="address"
			mode="region" 
			:visible.sync="showPop" 
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
		name:'mainStore',
		props:["show","info",'deviceName'],
		data() {
			return {
				shopName:'',
				nickname:'',
				rate:'',
				phone:'',
				area:'',
				address:'',
				provinceCode:'-1',
				cityCode:'-1',
				regionCode:'-1',
				latitude:'',
				longitude:'',
				start:'开始时间',
				stop:'结束时间',
				positive:'',
				picList:[],
				showPop:false,
				defaultRegion:["浙江省","杭州市","滨江区"],
				isOpenVoice:true,
			}
		},
		computed:{
			ifShow(){
				return this.show;
			},
			merchant(){
				return this.info;
			},
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		watch:{
			merchant(val){
				this.shopName = val.shopName;
				this.nickname = val.shopNickName;
				this.rate = val.profits;
				this.phone = val.phone;
				this.area = val.area;
				this.address = val.contactAddress;
				this.start = val.shopStartTime;
				this.stop = val.shopStopTime;
				this.positive = val.shopUrl;
				this.picList = val.shopImageUrl?val.shopImageUrl.split(','):[];
				this.latitude = val.latitude;
				this.longitude = val.longitude;
				this.isOpenVoice = val.isOpenVoice;
			}
		},
		methods:{
			checkUrl(url){
				uni.navigateTo({url:`${url}?deviceName=${this.deviceName}`})
			},
			switch1Change(e){
				this.isOpenVoice = e.detail.value;
			},
			onConfirm($event){
				
			},
			onCancel(){
				this.showPop = false;
			},
			onConfirm($event){ //省市区选择
				console.log($event)
				this.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				let adcode = $event.value[2];
				this.provinceCode = adcode.substring(0,2);
				this.cityCode = adcode.substring(0,4);
				this.regionCode = adcode;
			},
			// 选择行业类型
			bindChange($event){
				this.current = this.industries[$event.detail.value]
			},
			// 上传图片
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
										title:'请上传不小于5KB的图片',
										icon: 'none'
									})
								}else{
									uni.uploadFile({
										url: `${this.$store.state.baseUrl}/upload/?serviceType=user`,
										filePath: file,
										fileType: 'image',
										name:' file',
										success:res=>{
											let url = JSON.parse(res.data).data;
											if(type=='piclist'){
												this.picList.push(url.replace('http','https'));
											}else{
												this[type] = url.replace('http','https');
											}
										}
									})
								}
							}
						})
					}
				})
			},
			deleteImg(index){ //删除商家相册图片
				this.picList.splice(index,1);
			},
			previewImg(img){ //图片预览
				uni.previewImage({
					loop:true,
					current:img,
					urls: this.picList,
					success:res=>{
						console.log(res)
					}
				})
			},
			goMap(){  //导航
				uni.chooseLocation({
					success:res=>{
						console.log(res)
						this.address = res.address;
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						// this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${this.$store.state.mapKey}`)
						// .then(res=>{
						// 	console.log(res)
						// 	let data = res.result.address_component;
						// 	this.area = data.province + ' ' + data.city + ' ' + data.district;
						// 	this.defaultRegion = this.area.split(' ');
						// })
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
			checkRate(){  //检查让利比率
				let reg = /^[1-9]\d*|0$/;
				if(this.rate){
					if(!reg.test(this.rate)){
						uni.showToast({
							title:'请输入有效数字',
							icon: 'none'
						})
						this.rate = '';
					}else if(this.rate < 5 || this.rate > 30){
						uni.showToast({
							title:'请输入5%-30%范围内的让利比率',
							icon: 'none'
						})
					}
				}
			},
			checkForm(){ //确认信息填写完整
				if( !this.shopName || !this.nickname || !this.rate || !this.phone || !this.area || !this.address || !this.start || !this.stop || !this.positive || !this.picList){
					uni.showToast({
						title:'请填写完整所有信息',
						icon: 'none'
					})
				}else if(this.rate < 5 || this.rate > 30){
					uni.showToast({
						title:'请输入5%-30%范围内的让利比率',
						icon: 'none'
					})
				}else{
					this.submit();
				}
			},
			submit(){  //提交
				uni.showLoading({
					title:'加载中'
				})
				let params = {
					id:this.merchant.id,
					userId:this.$store.state.userInfo.id,
					shopName:this.shopName,
					shopNickName: this.nickname,
					profits: this.rate,
					phone:this.phone,
					contactAddress: this.address,
					shopStartTime: this.start,
					shopStopTime: this.stop,
					shopUrl:this.positive,
					shopImageUrl: this.picList.join(','),
					areaCode: this.provinceCode,
					areaCodeCity: this.cityCode,
					areaCodeAreas: this.regionCode,
					area: this.area,
					latitude: this.latitude,
					longitude: this.longitude,
					isOpenVoice:this.isOpenVoice
				}
				this.$fly.post(`/merchant/completionInfo`,params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.showToast({
							title:'保存成功'
						})
						if(this.isOpenVoice){
							this.$wxLogin();
						}
					}else{
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				})
			}
		},
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
					padding: 0 20rpx;
					height: 50px;
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
							.more{
								width: 26rpx;
								display: block;
							}
						}
						.frame{
							width: 90%;
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
								.pic{
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
								.pic{
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
		.btn{
			width: 670rpx;
			height: 38px;
			border-radius: 19px;
			background: #FF9D11;
			color: #fff;
			margin: 0 auto;
			margin-top: 30rpx;
		}
	
</style>
