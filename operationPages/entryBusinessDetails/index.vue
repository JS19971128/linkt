<template>
	<view class="container">
		<view class="top flex_center fz-14" :class="[form.status]">
			<view class="top-left">
				<view class="">申请编号：<text>{{form.id}}</text></view>
				<view class="">商户号：<text>{{form.merchantNo||''}}</text></view>
			</view>
			<view class="top-right flex_between">{{statusFun(form.status).name}}</view>
		</view>
		<view class="inError" v-if="imgMsg&&(form.status==='FAILED'||form.signStatus==0)">驳回原因：{{imgMsg}}</view>
		<view class="tab flex_center fz-14">
			<view class="item flex_center" :class="{active:current == item.value}" v-for="item in tab" :key="item.id" @click="changeTab(item.value)">{{item.text}}</view>
		</view>
		<!-- 法人信息 -->
		<legal-info ref="legalInfoForm" :show="current == 'legal' ? true : false"></legal-info>
		<!-- 企业设置 -->
		<company-info ref="companyInfoForm" :show="current == 'company' ? true : false"></company-info>
		<!-- 银行信息 -->
		<bank-info ref="bankInfoForm" :show="current == 'bank' ? true : false"></bank-info>
		<!-- 商家信息 -->
		<shop-info ref="shopInfoForm" :show="current == 'shop' ? true : false"></shop-info>
		<view class="btns" v-if="form.status=='FAILED' || form.status==='PASS'">
			<view class="btn fz-14 flex_center" v-if="form.status=='FAILED'" @click="submit">查询并更新</view>
			<view class="btn fz-14 flex_center" v-if="form.status==='PASS'" @click="updateEntryStatus">已完成</view>
		</view>
		
	</view>
</template>

<script>
	import legalInfo from './legalInfo/index.vue';
	import companyInfo from './companyInfo/index.vue';
	import bankInfo from './bankInfo/index.vue';
	import shopInfo from './shopInfo/index.vue';
	import {formateObjToParamStr,formatTime} from '@/common/util/util.js'
	export default{
		components:{
			legalInfo,
			companyInfo,
			bankInfo,
			shopInfo
		},
		data() {
			return {
				current:'legal',
				form:{},
				imgMsg:{},
				tab:[
					{id:1,text:'法人信息',value:'legal'},
					{id:2,text:'企业设置',value:'company'},
					{id:3,text:'银行信息',value:'bank'},
					{id:4,text:'商家信息',value:'shop'},
				],
				statusArr: [{
						name: '待审核',
						type: 'AUDITED',
						color:'#6e9a02'
					},
					{
						name: '已通过',
						type: 'PASS',
						color:'#5cbe88'
					},
					{
						name: '已完成',
						type: 'FINISH',
						color:'#999999'
					},
					{
						name: '未通过',
						type: 'FAILED',
						color:'#ce1212'
					}
				],
			}
		},
		methods:{
			//修改已通过状态
			async updateEntryStatus(){
				try{
					let {id} = this.form;
					uni.showLoading({
						title:'加载中'
					})
					let data = await this.$fly.post(`/entry/updateEntryStatus?id=${id}&status=FINISH`);
					uni.showToast({
					    title: '修改成功！',
					    duration: 2000,
						icon:'none'
					});
					this.init();
				}catch(e){
					console.error(e)
					uni.showToast({
					    title: '修改失败，请稍后重试！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
					uni.hideLoading();
				}
			},
			statusFun(status){
				for(let i of this.statusArr){
					if(i.type === status){
						return i;
					}
				}
				return {
						name: '未通过',
						type: 'FAILED',
						color:'#ce1212'
					}
			},
			changeTab(value){
				this.current = value;
			},
			async init(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let {userId} = this;
					let data = {
						userId
					}
					let details = await this.$fly.post(`/entry/findMerchantEntryByUserId?${formateObjToParamStr(data)}`);
					let form = details.data;
					
					let imgMsg = '';
					let nameObj = {
						FRONT_OF_ID_CARD:'正面身份证',
						BACK_OF_ID_CARD:'反面身份证',
						BUSINESS_LICENSE:'营业执照',
						PERMIT_FOR_BANK_ACCOUNT:'开户许可证',
						SIGN_BOARD:'门头照',
						INTERIOR_PHOTO:'室内照'
					}
					for(let i of form.merchantCredential){
						i.name = nameObj[i.credentialType]
					}
					this.imgMsg = (form.msg||"") + (form.signStatus == 0?'商家未完成签章':'') + '请修改后重新上传。';
					this.form = form;
					
					
					this.$refs.legalInfoForm.init(form);
					this.$refs.companyInfoForm.init(form);
					this.$refs.bankInfoForm.init(form);
					this.$refs.shopInfoForm.init(form);
					
					// debugger
				}catch(e){
					uni.showToast({
					    title: '加载数据失败！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
					uni.hideLoading();
				}
			},
			//提交
			async submit(){
				let {merchantCredential} = this.form;
				try{
					uni.showLoading({
						title:'加载中'
					})
					for(let i of merchantCredential){
						delete i.status;
						let params = formateObjToParamStr(i);
						await this.$fly.post(`/entry/alterCredential?${params}`);
					}
					uni.showToast({
					    title: '修改成功！',
					    duration: 2000,
						icon:'none'
					});
					// let data = await request.call(this,{method: "post",url:API.alterCredential,params});
				}catch(e){
					//TODO handle the exception
					console.error(e)
					uni.showToast({
					    title: '修改失败！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
					uni.hideLoading();
				}
			},
		},
		onLoad(query) {
			this.userId = query.id;
			this.init();
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding-top: 50rpx;
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: 130rpx;
		height: auto !important;
		.top{
			width: 710rpx;
			height: 180rpx;
			background: #fff;
			margin: 0 auto;
			border-radius: 8rpx;
			box-shadow: 0 0 20rpx 2rpx rgba(0,0,0,.1);
			color: #999999;
			margin-bottom: 50rpx;
			background-repeat: no-repeat;
			background-position: right;
			background-size: 180rpx 180rpx;
			&.AUDITED{
				background-image: url(../../static/images/operation/sh_01.png);
			}
			&.PASS{
				background-image: url(../../static/images/operation/sh_02.png);
			}
			&.FINISH{
				background-image: url(../../static/images/operation/sh_03.png);
			}
			&.FAILED{
				background-image: url(../../static/images/operation/sh_04.png);
			}
			.top-left{
				width: 530rpx;
				line-height: 50rpx;
				padding: 0 20rpx;
				text{
					color: #333;
				}
			}
			.top-right{
				width: 130rpx;
				color: #fff;
			}
		}
		.tab{
			background: #EEEEEE;
			color: #999999;
			height: 85rpx;
			.item{
				flex: 1;
			}
			.active{
				color: #FF9733;
				position: relative;
				&::after{
					display: block;
					content: '';
					color: #FF9733;
					width: 20rpx;
					height: 10rpx;
					background: url(../../static/images/home/tab_icon.png) no-repeat;
					background-size: 100% 100%;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: 40rpx;
				}
			}
		}
	}
	.btns{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		height: 100rpx;
		background: #fff;
		box-shadow:0px -1px 0px 0px rgba(222,222,222,1);
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		z-index: 99;
		.btn{
			flex: 1;
			margin: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1.2;
			color: #fff;
			background: #FF9D12;
			border-radius: 50rpx;
		}
	}
	.inError{
		margin: 0 20rpx 20rpx;
		padding: 5px 10px;
		background: #ffe5e5;
		color: rgba(255,98,119,1);
		border-radius: 4px;
		display:inline-block;
		line-height: 1.2;
		font-size: 12px;
	}
</style>
