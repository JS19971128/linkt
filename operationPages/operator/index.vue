<template>
	<view class="container">
		<view class="main" v-if="list.length>0">
			<view class="scroll-area" v-for="item in list" :key="item.id">
				 <!-- @touchstart="touchS" @touchmove="touchM" @touchend="touchE" 待增加功能：滑动删除 -->
				<view class="scroll-item flex_center" :style="{left:scrollW+'px'}" @click="goEdit(item)">
					<view class="item flex_center">
						<view class="item-left flex_center">
							<view><image :src="item.headImg" mode="aspectFill"></image></view>
						</view>
						<view class="item-right ">
							<view class="flex_between info">
								<view class="fz-14">{{item.nickName}}</view>
								<view class="fz-12">分润比：{{item.profits}}%</view>
							</view>
							<view class="flex_between">
								<view class="fz-12">{{item.phone}}</view>
								<view class="fz-12 level">{{item.title}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="delete flex_center">
					<image src="../../static/images/operation/delete.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="no_data flex_center" v-else>
			<image src="../../static/images/operation/expand_none.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">暂无运营人员</view>
				<view class="fz-12">您还未设置运营人员呢~</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="addOperator">新建运营人员</view>
		<!-- 根据手机号查询弹框 -->
		<view class="pop_wrap" v-if="showPhone">
			<view class="pop_content">
				<view class="close flex_center" @click="showPhone=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="fz-16 flex_center">根据手机号查询</view>
					<view class="frame flex_center"><input type="number" pattern="[0-9]*" placeholder="请输入对方的手机号码" placeholder-style="color:#CBCBCB;font-size:28rpx" v-model="phone" /></view>
					<view class="fz-14 check_btn flex_center" @click="checkPhone">查询</view>
				</view>
			</view>
		</view>
		<!-- 删除弹框 -->
		<view class="pop_wrap" v-if="showDelete">
			<view class="pop_content">
				<view class="box">
					<view class="fz-16 flex_center">确认删除</view>
					<view class="confirm flex_center fz-16">确认要删除此运营人员吗？</view>
					<view class="fz-14 pop_btn flex_between">
						<view class="flex_center" @click="showDelete=false">取消</view>
						<view class="flex_center" @click="confirmDelete">确认</view>
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
				showPhone: false,
				showDelete: false,
				list: [],
				phone: '',
				startX: '', // 删除按钮触摸开始位置
				delBtnW: 65, // 删除按钮宽度
				scrollW: 0,
			}
		},
		computed:{
			operator(){ //运营人员信息
				return this.$store.state.operatorData;
			}
		},
		methods:{
			touchS(e){ // 触摸开始
				// console.log(e)
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX;
				}
			},
			touchM(e){ // 滑动中
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnW = this.delBtnW;
					if (disX <= 0) { 
						this.scrollW = 0;
					}else if (disX > 0 && disX < delBtnW){ // 移动距离大于0并且小于删除按钮宽度，left值等于手指移动距离
							this.scrollW = disX * (-1);
					}else{
							//控制手指移动距离最大值为删除按钮的宽度
							this.scrollW = -65;
					}
				}
			},
			touchE(e){ // 手指离开
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnW = this.delBtnW;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					this.scrollW = disX > delBtnW / 2 ? -65 : 0;
				}
			},
			getList(){ //获取运营人员列表
				this.$fly.get(`/operation/list?userId=${this.$store.state.userInfo.id}&page=0&size=100`)
				.then(res=>{
					if(res.code == 0){
						this.list = res.data.content;
					}
				})
			},
			addOperator(){ //添加运营人员
				// 判断运营人员类型以此判断最多添加人数
				if(this.operator.type == 'OPERATION_AREA_CENTER'){
					var title = '运营人员最多只能添加9人';
					var length = 9;
				}else{
					var title = '运营人员最多只能添加2人';
					var length = 2;
				}
				if(this.list.length > length){
					uni.showToast({
						title
					})
				}else{
					this.showPhone = true;
				}
			},
			checkPhone(){ //查询是否可添加该用户为运营人员
				const regPhone = /^((1[0-9]{2})+\d{8})$/;
				if(!this.phone){
					uni.showToast({
						title:'请输入对方的手机号码'
					})
					return
				}
				if(!regPhone.test(this.phone)){
					uni.showToast({
						title:'手机号格式不正确'
					})
					return
				}
				this.$fly.get(`/user/findAreaUserByPhone?userId=${this.$store.state.userInfo.id}&phone=${this.phone}`)
				.then(res=>{
					if(res.code == 0){
						// 可以添加则进入运营人员添加页面
						uni.navigateTo({
							url:`/operationPages/addOperator/index?nickname=${res.data.aliNickName}&phone=${res.data.username}`
						})
					}else{
						uni.showToast({
							title:res.message
						})
					}
				})
			},
			goEdit(item){ //修改运营人员信息
				uni.navigateTo({
					url:`/operationPages/addOperator/index?nickname=${item.nickName}&phone=${item.phone}&id=${item.id}&title=${item.title}&profit=${item.profits}`
				})
			},
			confirmDelete(){ //删除运营人员
				
			}
		},
		onLoad:function(){
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding-top: 10px;
		padding-bottom: 110rpx;
		.scroll-area{
			width: 100%;
			height: 65px;
			position: relative;
			margin-bottom: 10px;
		}
		.scroll-item{
			position: absolute;
			width: 100%;
			z-index: 200;
			top: 0;
			left: 0;
		}
		.item{
			width: 710rpx;
			height: 65px;
			background: #fff;
			border-radius: 8rpx;
			padding: 10px 20rpx;
			box-sizing: border-box;
			.item-left{
				image{
					width: 45px;
					height: 45px;
					display: block;
					border-radius: 45rpx;
				}
			}
			.item-right{
				flex: 1;
				color: #999999;
				margin-left: 20rpx;
				line-height: 20px;
				image{
					width: 26rpx;
					display: block;
				}
				.info{
					.fz-14{
						color: #333;
					}
					.fz-12{
						color: #999999;
					}
				}
				.level{
					color: #FF9D12;
				}
			}
		}
		.delete{
			width: 65px;
			height: 65px;
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			z-index: 100;
			image{
				width: 37px;
				display: block;
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
	}
	.pop_content{
		width: 590rpx;
		padding: 50rpx 30rpx;
		padding-top: 20rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-bottom: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			// padding-top: 50rpx;
			.frame{
				width: 100%;
				height: 72rpx;
				border-radius: 36rpx;
				border: 2rpx solid #DCDCDC;
				margin-top: 50rpx;
				justify-content: flex-start;
				input{
					font-size: 28rpx;
					line-height: 28rpx;
					color: #333;
					padding: 0;
					margin-left: 20rpx;
				}
			}
			.confirm{
				color: #999999;
				margin-top: 50rpx;
			}
			.check_btn{
				width: 100%;
				height: 72rpx;
				border-radius: 36rpx;
				color: #fff;
				background: #FF9D29;
				margin-top: 50rpx;
			}
			.pop_btn{
				width: 100%;
				margin-top: 50rpx;
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
	.no_data{
		flex-direction: column;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		image{
			width: 180rpx;
			display: block;
		}
		.tip{
			line-height: 40rpx;
			margin-top: 40rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
</style>
