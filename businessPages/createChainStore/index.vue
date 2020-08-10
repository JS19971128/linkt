<template>
	<view class="bg">
		<!-- 主店信息 -->
		<view class="info fz-14">
			<view class="main">
				<!-- 商户类型 -->
				<view class="item flex_center">
					<view class="item-name">商户类型</view>
					<view class="item-content">
						<picker mode="selector" :range="merchantType" :range-key="'label'" @change="bindChange">
							<view class="flex_between">
								<view>{{current}}</view>
								<view>
									<image class="more" src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 商家名称 -->
				<view class="item flex_center" v-show="current=='非同一个商户号'">
					<view class="item-name">商户号</view>
					<view class="item-content">
						<input class="frame" type="text" placeholder="请输入正确的商户号，提交后将无法修改" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
					</view>
				</view>
				<!-- 分店名称 -->
				<view class="item flex_center">
					<view class="item-name">分店名称</view>
					<view class="item-content">
						<input class="frame" type="text" placeholder="请输入分店全称" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
					</view>
				</view>
				<!-- 分店简称 -->
				<view class="item flex_center">
					<view class="item-name">分店简称</view>
					<view class="item-content">
						<input class="frame" type="text" placeholder="请输入分店简称，10字以内" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
					</view>
				</view>
				<!-- 联系电话 -->
				<view class="item flex_center">
					<view class="item-name">联系电话</view>
					<view class="item-content">
						<input class="frame" type="text" placeholder="请输入分店电话号码" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">所在地区</view>
					<view class="item-content">
						<input class="frame" type="text" v-model="location" disabled placeholder="请选择分店所在地区" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center">
					<view class="item-name">详细地址</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">
								<input class="frame" type="text" placeholder="请选择详细地址" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/>
							</view>
							<view>
								<image class="more" src="../../static/images/common/more_gray.png" mode="widthFix"></image>
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
								<image class="pic" :src="positive" mode="aspectFit"></image>
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
								<image class="pic" :src="item.url" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" @click="upload('piclist')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">创建分店</view>
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
		props:["show"],
		data() {
			return {
				merchantType:[
					{
						label:'同一个商户号',
						value:'false'
					},
					{
						label:'非同一个商户号',
						value:'false'
					}
				],
				current:'',
				location:'',
				start:'开始时间',
				stop:'结束时间',
				positive:'',
				picList:[],
				showPop:false,
				defaultRegion:["浙江省","杭州市","滨江区"],
			}
		},
		computed:{
			ifShow(){
				return this.show;
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
				this.current = this.merchantType[$event.detail.value]['label']
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		min-height: 100vh;
		padding-bottom: 100rpx;
	}
		.info{
			padding-top: 20rpx;
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
								.pic{
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
			margin: 0 auto;
			margin-top: 100rpx;
		}
	
</style>
