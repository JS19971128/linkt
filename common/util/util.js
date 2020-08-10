	import store from '../../store/index.js'
	const formatTime = date => {
		date = new Date(date);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();

		return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
	};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 计时器
 * @param t	倒计时(s)
 * @param fn
 */
function timer(t, fn) {
  setTimeout(function () {
    t--;
    if (t !== 0) timer(t, fn);
		store.state.countDownTime = t;
    fn(t);
  }, 1000);
};

/*
* 对象解析为url
* paramObj 对象
*/
function formateObjToParamStr(paramObj) {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${paramObj[attr]}`);
  }
  return sdata.join('&');
};

module.exports = {
  formatTime: formatTime,
  timer,
  formateObjToParamStr
}