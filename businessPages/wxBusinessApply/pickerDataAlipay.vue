<template>
	<view>
		<view class="flex_between" @click="show=true">
			<view class='right'>
				<input type="text" v-model="addressName" disabled placeholder="请选择地址" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
			</view>
			<view>
				<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
			</view>
		</view>
		<w-picker mode="linkaged" ref="wPicker" :visible.sync="show" @confirm="onConfirm($event,'linkaged')"></w-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				multiArray: [], // 三维数组数据
				multiIndex: [0, 0, 0], // 默认的下标
				step: 0, // 默认显示请选择
				currnetProvinceKey:'',
				currnetCityKey:'',
				addressName:'',
				show:false
			}
		},
		props:[],
		methods: {
			onConfirm(e){
				let {multiArray,multiIndex,storeList} = e;
				this.addressName = multiArray[0][multiIndex[0]]+' '+multiArray[1][multiIndex[1]]+' '+multiArray[2][multiIndex[2]];
				var storeCode = storeList[multiIndex.length - 1].id
				console.log(storeCode)
				this.$emit("regionCodeFun",{regionCode:storeCode,addressName:this.addressName})
			},
			init(name){
				this.addressName = name;
				this.$refs.wPicker.$refs.linkageDPicker.initData();
				
			},
		}
	}
</script>

<style scoped>
	image{
		width: 24rpx;
		display: block;
	}
</style>
