<template>
	<view>
		<picker mode="multiSelector" :range="multiArray" @columnchange="columnchange" :value="multiIndex" @change='pickchange'>
			<view class="flex_between">
				<view class='right'>
					<input type="text" v-model="addressName" disabled placeholder="请选择地址" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
				</view>
				<view>
					<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
				</view>
			</view>
		</picker>
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
				addressName:''
			}
		},
		methods: {
			init(name){
				this.addressName = name;
				this.getProvince() // 页面加载后就调用函数 获取省级数据
			},
			getProvince() { // 获取省
				this.$fly.post('/entry/getRegionCodeList?level=省').then((data) => {
					var provinceList = [...data] // 放在一个数组里面
					var provinceArr = data.map((item) => {
						return item.name
					}) // 获取数据里面的value值，就是只用数据的名称 
					this.multiArray = [provinceArr, [],[]];
					this.provinceList = provinceList;
					this.provinceArr = provinceArr;
					var defaultCode = this.provinceList[0].id // 使用第一项当作参数获取市级数据
					if (defaultCode) {
						this.currnetProvinceKey = defaultCode // 保存在当前的省级key
						this.getCity(defaultCode) // 获取市级数据
					}
				})
			},
			getCity(code) { // 获取市级数据
				this.currnetProvinceKey = code;
				this.$fly.post(`/entry/getRegionCodeList?pid=${code}`).then((data) => {
					var cityArr = data.map((item) => {
						return item.name
					})
					var cityList = [...data]
					this.multiArray = [this.provinceArr, cityArr, []];
					this.cityList = cityList;
					this.cityArr = cityArr;
					var defaultCode = this.cityList[0].id // 用第一个获取门店数据
					if (defaultCode) {
						this.currnetCityKey = defaultCode;// 存下当前选择的城市key
						this.getStore(defaultCode) // 获取门店数据
					}
				})
			},
			getStore(code) {
				this.currnetCityKey = code;// 更新当前选择的市级key
				this.$fly.post(`/entry/getRegionCodeList?pid=${code}`).then((data) => {
					var storeList = [...data]
					var storeArr = data.map((item) => {
						return item.name
					})
					this.multiArray = [this.provinceArr, this.cityArr, storeArr] // 重新赋值三级数组 此时的数组大概是这样 [['江苏省', '福建省'], ['徐州市'], ['徐州第一门店','徐州第二门店']]
					this.storeList = storeList; // 保存下门店原始数据
					this.storeArr = storeArr;// 保存下门店名称，可以不保存
				})
			},
			columnchange(e) { // 滚动选择器 触发的事件
				var column = e.detail.column // 当前改变的列
				var data = {
					multiIndex: JSON.parse(JSON.stringify(this.multiIndex)),
					multiArray: JSON.parse(JSON.stringify(this.multiArray))
				}
				data.multiIndex[column] = e.detail.value; // 第几列改变了就是对应multiIndex的第几个，更新它
				switch (column) { // 处理不同的逻辑
					case 0: // 第一列更改 就是省级的更改
						var currentProvinceKey = this.provinceList[e.detail.value].id
						if (currentProvinceKey != this.currnetProvinceKey) { // 判断当前的key是不是真正的更新了
							this.getCity(currentProvinceKey) // 获取当前key下面的市级数据
						}

						data.multiIndex[1] = 0 // 将市默认选择第一个
						break;

					case 1: // 市发生变化
						var currentCitykey = this.cityList[e.detail.value].id
						if (currentCitykey != this.currnetCityKey) { // 同样判断
							this.getStore(currentCitykey) // 获取门店
						}
						data.multiIndex[2] = 0 // 门店默认为第一个
						break;
				}
				this.multiIndex = data.multiIndex;
				this.multiArray = data.multiArray;
				// 更新数据
			},
			pickchange(e) {
				this.step = 1;// 更新，用来选择用户选中的门店
				this.multiIndex = e.detail.value;// 更新下标字段
				let {multiArray,multiIndex} = this;
				this.addressName = multiArray[0][multiIndex[0]]+' '+multiArray[1][multiIndex[1]]+' '+multiArray[2][multiIndex[2]];
				this.submit()
			},

			submit() { // 保存的时候 获取当前选择门店的key 丢给后端开发即可
				var storeCode = this.storeList[this.multiIndex.length - 1].id
				this.$emit("regionCodeFun",{regionCode:storeCode,addressName:this.addressName})
			}
		}
	}
</script>

<style scoped>
	image{
		width: 24rpx;
		display: block;
	}
</style>
