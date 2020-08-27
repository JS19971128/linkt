<template>
	<view class="bank_card_list">
	   <view class="china_bank" v-for="(item,index) in list" :class="{'bg_color': oddEven(index) == false}" >
	   	  <view class="list-touch clearfix" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" :data-index="index" :style="item.txtStyle" @click="pickBank(item)">
	   	  	<view class="build">
	   	  		<text class="name">{{item.bankName}}</text> <text class="account">{{bankType(item.settleBankType).status}}</text>
	   	  	</view>
	   	  	<view class="card_number">
	   	  		{{bankNmberShow(item.accountNo)}}
	   	  	</view>
	   	  	<image class="card_logo" src="../../static/images/common/card_logo.png" mode=""></image>
	   	  </view>
		  
		  <view class="list-delete" @click= "deleteMember(item.id)" >
			  删除
		  </view>
	   </view>
	   
	   <!-- 添加银行卡 -->
	   <view class="add_bank_card" @click="goAddBankCard">
	   	 +  添加银行卡
	   </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				list: null,
				delBtnWidth: 100, //删除按钮宽度单位（rpx）
				startX:'',
			}
		},
		methods: {
			touchS: function (e) {
				// console.log('touchS')
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX=e.touches[0].clientX
					// console.log(this.startX)
				}
			},
			touchM: function (e) {
				 // console.log('touchM')
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyle = "";
					if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyle = "left:0px";
					} else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
						txtStyle = "left:-" + disX + "px";
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyle = "left:-" + delBtnWidth + "px";
						}
					}
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.list;
					list[index].txtStyle = txtStyle;
					// console.log(list[index].txtStyle)
					//更新列表的状态
					this.list = list;
				}
			},
			touchE: function (e) {
				// console.log('touchE')
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.list;
					list[index].txtStyle = txtStyle;
					// console.log(list[index].txtStyle)
					//更新列表的状态{
					this.list = list
				}
			},
			//点击删除按钮事件
			deleteMember: function (id) {
				var _this = this;
                uni.showModal({
                    title: '提示',
                    content: '确定删除?',
                    success: function (res) {
                        if (res.confirm) {
                            _this.$fly.post(`/transfer/deleteBankById?id=` + id)
                            	.then(res => {
                            		uni.hideLoading();
                            		if (res.code == 0) {
                            			uni.showToast({
                            			    title: '删除成功！',
                            				icon:'success',
                            			    duration: 2000
                            			});
										_this.list = [];
										_this.getBankList();
                            		} else {
                            			uni.showToast({
                            			    title: res.message,
                            				icon: 'none',
                            			    duration: 2000
                            			});
                            		}
                            	})
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
				
			},
			// 选择银行卡号
			pickBank(item) {
			    console.log(item);
				this.$store.state.bankInfo = item;
				uni.navigateBack({
				    delta: 1
				});
			},
			goAddBankCard() {
				uni.navigateTo({
					url:'/userPages/addBankCard/index'
				})
			},
			bankType(status) {
				switch (status) {
					case "B2B":
						return {
							status: "对公账户"
						};
					case "B2C":
						return {
							status: "个人账户"
						};
					default:
						return "";
				}
			},
			bankNmberShow(num) {
				var num1 = num.replace(/(.{4})/g, "$1 ");
				return num1;
			},
			// 获取银行卡列表
			getBankList() {
				this.$fly.post(`/transfer/findBank?userId=` + this.$store.state.userInfo.id)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							this.list = res.data;
						} else {
							uni.showToast({
							    title: res.message,
								icon: 'none',
							    duration: 2000
							});
						}
					})
			},
			oddEven(index) {
				if (index%2 == 0) {
					return true;
				} else {
					return false;
				}
			}
		},
		onShow() {
			this.getBankList();
		}
	}
</script>

<style lang="scss" scoped>
	.bank_card_list {
		min-height: 100vh;
		background-color: #f2f2f2;
		padding: 30rpx 20rpx 0 20rpx;
		box-sizing: border-box;
		.bg_color {
			background:rgba(255,151,51,1)!important;
		}
		.china_bank {
			position: relative;
			height:203rpx;
			box-shadow:0px 1px 6px 0px rgba(0, 0, 0, 0.15);
			border-radius:8rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;
			overflow: hidden;
			.build {
				.name {
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
					margin-right: 30rpx;
				}
				.account {
					font-size:26rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
				}
			}
			.card_number {
				font-size:42rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				margin-top: 25rpx;
			}
			.card_logo {
				position: absolute;
                width: 140rpx;
				height: 121rpx;
				right: 0;
				bottom: 0;
			}
			.list-touch{
			    position: relative;
			    width: 100%;
				height: 100%;
				background:rgba(117,185,255,1);
				padding-left: 20rpx;
				padding-top: 43rpx;
				box-sizing: border-box;
			    z-index: 5;    
			    transition: left 0.2s ease-in-out;   
			    white-space:nowrap;   
			    overflow:hidden;   
			    text-overflow:ellipsis; 
			}
			.list-delete{
				position: absolute;
				top: 0;
			    right: 0; 
			    float: left;
			    width: 100px;
			    height: 203rpx;
			    line-height: 203rpx;
			    background-color: #EA5863;
			    border-radius: 0 8rpx 8rpx 0;
			    color: #fff;
			    font-size: 18px;
			    font-weight: lighter;
			    text-align: center;
			}
		}
		.add_bank_card {
			height:140rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height: 140rpx;
			padding-left: 40rpx;
		}
	}
</style>
