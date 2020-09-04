<template>
	<view class="bg">
		<view class="info fz-14">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 商家名称 -->
				<view class="item flex_center">
					<view class="item-name">商家名称</view>
					<view class="item-content">{{info.shopName}}</view>
				</view>
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">{{info.shopNickName}}</view>
				</view>
				<!-- 让利比率 -->
				<view class="item flex_center">
					<view class="item-name">让利比率</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">{{info.profits}}</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content ">
						<view class="flex_between">
							<view>{{info.shopBusinessName}}</view>
							<view>
								<image class="more" src="../../static/images/common/xiala.png" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center">
					<view class="item-name">所在地区</view>
					<view class="item-content">{{info.area}}</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center">
					<view class="item-name">详细地址</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">{{info.contactAddress}}</view>
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
						<view class="flex_between">{{info.shopStartTime}}</view>
						<view class="line">—</view>
						<view class="flex_between" >{{info.shopStopTime}}</view>
					</view>
				</view>
				<!-- 门头照 -->
				<view class="item flex_center">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 正面 -->
							<view class="uploadPic flex_center" @click="previewImg(info.shopUrl,[info.shopUrl])">
								<image class="pic" :src="info.shopUrl" mode="aspectFill"></image>
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
							<view class="pic_list flex_center" v-for="(item,i) in picList" :key="i" @click="previewImg(item,picList)">
								<image class="pic" :src="item" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="title" v-if="info.status!=='normal'">审核商家</view>
			<view class="main" v-if="info.status!=='normal'">
				<!-- 商户号 -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="item flex_center">
					<view class="item-name">商户号</view>
					<view class="item-content">
						<input class="frame" type="text" v-model="wxpayMchId" placeholder="请填写商户号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- #endif -->
				<!-- 审核备注 -->
				<view class="item flex_center note">
					<view class="item-name">审核备注</view>
					<view class="item-content">
						<textarea placeholder="审核不通过时，需要填写备注" v-model="note" :disabled="note" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="btn_wrap flex_center" v-if="info.status=='audit'">
			<view class="btn fz-14 flex_center">
				<view class="flex_center" @click="showRefuse=true">不通过</view>
				<view class="flex_center" @click="showPass=true">通过</view>
			</view>
		</view> -->
		<!-- 确认通过 -->
		<view class="pop_wrap" v-if="showPass">
			<view class="pop_content">
				<view class="box">
					<view class="fz-16 flex_center">确认通过</view>
					<view class="confirm flex_center fz-16">是否确认通过审核？</view>
					<view class="fz-14 pop_btn flex_between">
						<view class="flex_center" @click="showPass=false">取消</view>
						<view class="flex_center" @click="submit('normal')">确认</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 驳回 -->
		<view class="pop_wrap" v-if="showRefuse">
			<view class="pop_content">
				<view class="box">
					<view class="fz-16 flex_center">驳回</view>
					<view class="confirm flex_center fz-16">是否确认驳回申请？</view>
					<view class="fz-14 pop_btn flex_between">
						<view class="flex_center" @click="showRefuse=false">取消</view>
						<view class="flex_center" @click="submit('audit_failtrue')">确认</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				picList:[],
				showPass: false,
				showRefuse: false,
				info:{},
				note:'',
				wxpayMchId:''
			}
		},
		methods:{
			getData(id){ //获取商户数据
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/merchant/get?id=${id}`)
				.then(res=>{
					uni.hideLoading();
					if(res.code == 0){
						this.info = res.data;
						this.picList = res.data.shopImageUrl.split(',');
						this.note = res.data.note || '';
						this.wxpayMchId = res.data.wxpayMchId || '';
					}
				})
				.catch(err=>{
					uni.hideLoading();
				})
			},
			// 图片预览
			previewImg(img,urls){
				uni.previewImage({
					loop:true,
					current:img,
					urls,
					success:res=>{
						console.log(res)
					}
				})
			},
			submit(status){ //提交
				let {note,wxpayMchId} = this;
				if(!note && status=='audit_failtrue'){
					uni.showToast({
						title:'请填写不通过备注',
						icon: 'none'
					})
					return
				}
				if(!wxpayMchId && status=='normal'){
					uni.showToast({
						title:'请填写商户号！！',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				let params = {
					id: this.info.id,
					note,
					status,
					wxpayMchId,
					userId: this.$store.state.userInfo.id
				}
				this.$fly.post('/merchant/auditMerchant',params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.navigateTo({
							url:'/operationPages/areaBusiness/index'
						})
					}else{
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading()
				})
			}
		},
		onLoad:function(query){
			this.getData(query.id);
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		min-height: 100vh;
		background: #eee;
	}
	.info{
		line-height: 28rpx;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.note{
				align-items: flex-start;
			}
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
					textarea{
						padding: 0;
						font-size: 28rpx;
						line-height: 28rpx;
						color: #333;
					}
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
	.btn_wrap{
		width: 100%;
		height: 106rpx;
		background: #fff;
		margin-top: 50rpx;
		.btn{
			width: 670rpx;
			height: 74rpx;
			border-radius: 37rpx;
			border: 2rpx solid #FF9834;
			>view{
				height: 74rpx;
				flex: 1;
				&:first-child{
					color: #FF9834;
				}
				&:last-child{
					background: #FF9D11;
					color: #fff;
					border-top-right-radius: 37rpx;
					border-bottom-right-radius: 37rpx;
				}
			}
		}
	}
	.pop_content{
		width: 590rpx;
		padding: 0 30rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-top: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			padding-top: 50rpx;
			.confirm{
				color: #999999;
				margin-top: 50rpx;
			}
			.pop_btn{
				width: 100%;
				margin: 50rpx 0;
				>view{
					width: 265rpx;
					height: 72rpx;
					border-radius: 36rpx;
					&:first-child{
						color: #999999;
						border: 2rpx solid #999;
					}
					&:last-child{
						color: #fff;
						background: #FF9D29;
						border: 2rpx solid #FF9D29;
					}
				}
			}
		}
	}
</style>
