<template>
	<view class="bg">
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
				<view class="line"></view>
				<view class="step-item flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">资料补充</view>
			<view class="main">
				<!-- 经营类目 -->
				<view class="item flex_center">
					<view class="item-name">经营类目</view>
					<view class="item-content ">
						<!-- 经营类目类型选择 -->
						<view>
							<picker mode="selector" :range="firstList" :range-key="'name'" @change="firstChange">
								<view class="flex_between my_picker">
									<view>
										<input type="text" v-model="first" :disabled="!first" placeholder="请选择一级经营类目" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
									</view>
									<view>
										<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
									</view>
								</view>
							</picker>
						</view>
						<view v-show="first">
							<picker mode="selector" :range="secondList" :range-key="'name'" @change="secondChange">
								<view class="flex_between my_picker">
									<view>
										<input type="text" v-model="second" :disabled="!second" placeholder="请选择二级经营类目" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
									</view>
									<view>
										<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
									</view>
								</view>
							</picker>
						</view>
						<view v-show="second">
							<picker mode="selector" :range="thirdList" :range-key="'name'" @change="thirdChange">
								<view class="flex_between my_picker">
									<view>
										<input type="text" v-model="third" :disabled="!third" placeholder="请选择三级经营类目" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
									</view>
									<view>
										<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
									</view>
								</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 执照号码 -->
				<view class="item flex_center">
					<view class="item-name">执照号码</view>
					<view class="item-content flex_center">
						<input type="text" v-model="licenceNo" placeholder="请输入营业执照上的注册号" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 营业执照 -->
				<view class="item flex_center">
					<view class="item-name">营业执照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 营业执照 -->
							<view class="uploadPic flex_center" v-if="certificate">
								<image :src="certificate" mode="aspectFill"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('certificate')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 资质补充 -->
				<view class="item flex_center" v-show="licence">
					<view class="item-name">资质补充</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 资质补充 -->
							<view class="uploadPic flex_center" v-if="positive">
								<image :src="positive" mode="aspectFill"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 营业期限 -->
				<view class="item flex_center">
					<view class="item-name">营业期限</view>
					<view class="item-content flex_center">
						<radio-group @change="radioChange">
							<label>
								<radio value="true" style="transform:scale(0.7)" color="#FF9D12"/><text>长期有效</text>
								<radio value="false" style="transform:scale(0.7);margin-left: 20px;" color="#FF9D12"/><text>短期</text>
							</label>
						</radio-group>
					</view>
				</view>
				<!-- 期限日期 -->
				<view class="item flex_center">
					<view class="item-name">期限日期</view>
					<view class="item-content flex_center">
						<view class="">
							<!-- 期限日期 -->
							<picker mode="date" @change="limitDate">
								<view class="flex_between" :class="{date:deadlineDate=='请选择期限日期',active:deadlineDate!=='请选择期限日期'}">{{deadlineDate}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 门头照 -->
				<view class="item flex_center">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 门头照 -->
							<view class="uploadPic flex_center" v-if="opposite" @click="upload('opposite')">
								<image :src="opposite" mode="aspectFill"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('opposite')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">下一步</view>
	</view>
</template>

<script>
	import ali_jylm from '../../common/util/ali_jylm.js'
	export default{
		data() {
			return {
				firstList: [],
				secondList: [],
				thirdList: [],
				first: '',
				second: '',
				third: '',
				class_code:'', //类目编码
				licence: false,
				licenceNo:'', //执照号码
				positive:'',  //资质补充
				opposite: '',  //门头照
				certificate:'', //营业执照
				deadline:'', //营业期限
				deadlineDate: '请选择期限日期',
			}
		},
		methods:{ 
			// 选择证件类型
			firstChange($event){
				console.log($event)
				this.first = this.firstList[$event.detail.value]['name'];
				this.secondList = ali_jylm[$event.detail.value]['children'];
			},
			secondChange($event){
				this.second = this.secondList[$event.detail.value]['name'];
				this.thirdList = this.secondList[$event.detail.value]['children'];
			},
			thirdChange($event){
				this.third = this.thirdList[$event.detail.value]['name'];
				this.class_code = this.thirdList[$event.detail.value]['code'];
				this.licence = this.thirdList[$event.detail.value]['licence'];
			},
			// 上传照片
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
			radioChange($event){
				this.deadline = $event.detail.value;
			},
			// 选择期限日期
			limitDate($event){
				this.deadlineDate = $event.detail.value;
			},
			next(){
				if( !this.class_code || !this.opposite || !this.certificate || !this.licenceNo ){
					uni.showToast({
						title:'请填写完整信息'
					})
					return
				}
				if( this.licence && !this.positive){
					uni.showToast({
						title:'请上传资质补充'
					})
					return
				}
				this.$store.state.form.mccCode = this.class_code;
				this.$store.state.form.specialLicensePic = this.positive;
				this.$store.state.form.shopSignBoardPic = this.opposite;
				this.$store.state.form.businessLicensePic = this.certificate;
				this.$store.state.form.businessLicenseNo = this.licenceNo;
				this.$store.state.form.longTerm = this.deadline;
				this.$store.state.form.dateLimitation = this.deadlineDate;
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyThree/index'
				})
			}
		},
		onLoad:function(){
			this.firstList = ali_jylm;
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		padding-bottom: 30px;
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
					.my_picker{
						padding: 10rpx 0;
						>view{
							&:first-child{
								width: 80%;
							}
						}
					}
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						color: #333;
						line-height: 28rpx;
						font-size: 28rpx;
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
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		margin: 0 auto;
		margin-top: 30px;
	}
</style>
