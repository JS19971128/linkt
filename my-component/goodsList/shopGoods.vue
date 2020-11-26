<template>
	<view class="column">
		<view class="column-item">
			<view class="column-item-list" v-for="(item,index) in list" :key="item.id">
				<view class="column-item-list-goods" @click="goCommodity(item.id)">
					<view class="column-item-list-imgs">
						<image class="column-item-list-imgs-img" :src="item.listUrl"></image>
						<view class="column-item-list-imgs-title" v-if="item.isDraw">消费夺宝</view>
					</view>
					<view class="column-item-list-detail">
						<view class="detail-head">
							<view class="detail-title">{{item.commodityName}}</view>
							<view class="detail-active">
								<view class="detail-active-coupon">最高可享{{profitsDiscount(item.profits)}}折</view>
								<view class="detail-active-status" v-if="type!=='HOME' && type!=='examine'">
									{{item.auditStatus==='success'?status(item.commodityStatus):auditStatus(item.auditStatus)}}
								</view>
								<view class="detail-active-status" v-if="type==='examine'">{{auditStatus(item.auditStatus)}}</view>
								
							</view>
						</view>
						<view class="detail-info">
							<view class="detail-info-left">
								<view class="info-price">
									<text class="info-price-f">￥</text>{{item.priceSale}}
								</view>
								<view class="info-sale">已售{{item.saleSum}}</view>
							</view>
							<view class="detail-info-btn" v-if="type==='HOME'" @click.stop="goodsAdd(item)">增加库存</view>
							<view class="detail-info-txt" v-if="type!=='HOME'">库存{{item.stockNum || 0}}</view>
						</view>
					</view>
				</view>
				<view class="column-item-list-action" v-if="type!=='HOME'">
					<block v-if="type!=='examine'">
						<view class="action-btn" @click.stop="goodsDelete(item)">删除</view>
						<view class="action-btn" @click.stop="goodsAdd(item)">修改库存</view>
						<block v-if="item.auditStatus !== 'audit' && item.auditStatus !== 'failure' ">
							<view class="action-btn" @click.stop="goodsShelf(item)" v-if="item.commodityStatus !== 'offline' ">下架</view>
							<view class="action-btn" @click.stop="goodsUp(item)" v-else>上架</view>
						</block>
						<view class="action-btn" @click.stop="goodsModify(item)">修改</view>
					</block>
					
					<block v-if="type==='examine' && item.auditStatus==='audit'">
						<view class="action-btn" @click.stop="goodsNo(item)">审核不通过</view>
						<view class="action-btn" @click.stop="goodsGo(item)">审核通过</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {profitsDiscount} from '@/common/util/public.js'
	export default{
		props:{
			list:{
				type:Array,
				default:()=>[]
			},
			type:{
				type:String,
				default:'HOME'
			}
		},
		methods:{
			profitsDiscount,
			//删除
			goodsDelete(row){
				this.$emit('goodsDelete',row);
			},
			//增加库存
			goodsAdd(row){
				this.$emit('goodsAdd',row);
			},
			//下架
			goodsShelf(row){
				this.$emit('goodsShelf',row);
			},
			//上架
			goodsUp(row){
				this.$emit('goodsUp',row);
			},
			//修改
			goodsModify(row){
				this.$emit('goodsModify',row);
			},
			//跳转商品
			goCommodity(id){
				let str = `?id=${id}&shopStatus=true`;
				if(this.type === 'examine'){
					str += '&examineName=true'
				}
				
				uni.navigateTo({
					url:`/shoppingPages/commodity/index${str}`
				})
			},
			goodsGo(row){
				this.$emit('goodsGo',row);
			},
			goodsNo(row){
				this.$emit('goodsNo',row);
			},
			status(s){
				let obj = {
					offline:'下架',
					online:'在售',
					audit:'待审核',
					agree:'',
					refund:'已退款',
					cancel:'已取消'
				}
				return obj[s];
			},
			auditStatus(s){
				let obj = {
					audit:'待审核',
					failure:'审核不通过',
					success:'审核通过',
				}
				return obj[s];
			}
		},
		filters:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.column{
		display: flex;
		flex-direction: column;
		&-item{
			&-list{
				display: flex;
				width: 100%;
				box-sizing: border-box;
				padding-bottom: 20rpx;
				flex-direction: column;
				&-action{
					width: 100%;
					display: flex;
					justify-content: flex-end;
					box-shadow:0px 1rpx 0px 0px rgba(222,222,222,1);
					padding: 20rpx 0;
					.action-btn{
						width:138rpx;
						height:46rpx;
						background:rgba(255,255,255,1);
						border:2rpx solid rgba(153, 153, 153, 1);
						border-radius:23rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #999999;
						margin-right: 20rpx;
						font-size: 24rpx;
					}
				}
				&-goods{
					display: flex;
					box-shadow:0px 1rpx 0px 0px rgba(222,222,222,1);
					padding: 0rpx 20rpx 20rpx;
					margin-left: 20rpx;
					width: calc(100% - 20rpx);
					box-sizing: border-box;
					.column-item-list-imgs{
						position: relative;
						width: 180rpx;
						height: 180rpx;
						&-img{
							width: 100%;
							height: 100%;
							border-radius: 8rpx;
						}
						&-title{
							position: absolute;
							top: 0;
							left: 0;
							width:88rpx;
							height:33rpx;
							background:rgba(255,41,41,1);
							font-size: 18rpx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 8rpx 0 8rpx 0;
						}
					}
					.column-item-list-detail{
					flex: 1;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.detail-head{
						.detail-title{
							font-size:28rpx;
							color:#000;
							line-height:38rpx;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.detail-active{
							display: flex;
							align-items: center;
							margin-top: 20rpx;
							&-coupon{
								font-size:26rpx;
								color:#FE4545;
								line-height:1;
								flex: 1;
							}
							&-status{
								font-size: 28rpx;
							}
						}
					}
					.detail-info{
						display: flex;
						align-items: flex-end;
						margin-top: 20rpx;
						line-height: 1;
						justify-content: space-between;
						&-txt{
							font-size:24rpx;
							color: #999999;
						}
						&-left{
							display: flex;
							align-items: center;
							.info-price{
								font-size: 38rpx;
								color: #FF9834;
								&-f{
									font-size: 18rpx;
								}
							}
							.info-sale{
								color: #999999;
								font-size: 24rpx;
								margin-left: 20rpx;
							}
						}
						&-btn{
							width:136rpx;
							height:42rpx;
							background:rgba(255,41,41,1);
							border-radius:21rpx;
							color: #fff;
							font-size: 24rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
				}
			}
		}
	}
</style>
