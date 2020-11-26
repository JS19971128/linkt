function profitClass(number = 5){
	let num = Number(number);
	let profits = num;
	if(num>=6 && num<=11){  //商家让利6%-11%之间，消费10元拿出1%送0.1元夺宝券，剩下的5-10%用于分润和抵扣优惠券
		profits = num - 1
	}else if(num>=12 && num<=17){ //商家让利12%-17%之间，消费10元拿出2%送0.2元夺宝券，剩下的10-15%用于分润；
		profits = num - 2
	}else if(num>=18 && num<=23){  //商家让利18%-23%之间，消费10元拿出3%送0.3元夺宝券，剩下的15-20%用于分润；
		profits = num - 3
	}else if(num>=24 && num<=29){ //商家让利24%-29%之间，消费10元拿出4%送0.4元夺宝券，剩下的20-25%用于分润；
		profits = num - 4
	}else if(num===30){ //商家让利30%，消费10元拿出5%送0.5元夺宝券，，剩下的25%用于分润；
		profits = num - 5
	}
	return profits;
}

function profitsDiscount(profits){
	let price = profitClass(profits);
	let shop = ((price*10)*(0.7*10))/100; //70%可以用优惠券抵扣
	let transform = ((100*10)-(shop*10))/100; //100份分成10份算折扣
	return transform;
}

module.exports = {
	profitsDiscount
}