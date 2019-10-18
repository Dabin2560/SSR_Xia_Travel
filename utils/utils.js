// 
export function computationTime(dep_time, arr_time) {

  if(!dep_time || !arr_time) return;

  // 将所有的时间，以：切割时间格式：12：30 ，并转化为分钟
  // dep 出发  arr到达
  const dep = dep_time.split(":");
  // console.log(dep); // ["20", "30"]
  const arr = arr_time.split(":");
  // 再将得出的数组，参数，例20:30 小时*60=分钟 + 分钟
  const depSum = dep[0] * 60 + +dep[1];
  const arrSum = arr[0] * 60 + +arr[1];
  // console.log(depSum, arrSum); //
  // 到达-出发 =间隔时间
  let elapsed = arrSum - depSum;
  // 判断 elapsed若得出负数，则为 到达城市为第二天凌晨时间
  if (elapsed < 0) {
    elapsed = arrSum + 24 * 60 - depSum;
  }
  // console.log(Math.floor(elapsed/60)+":"+elapsed%60)

  return `${Math.floor(elapsed / 60)}时${elapsed % 60}分`;




  // // 数据还未请求回来
  // if (!this.data.dep_time) return "";

  // // 转化为分钟
  // const dep = this.data.dep_time.split(":");
  // const arr = this.data.arr_time.split(":");
  // // 出发/到达 总分钟
  // const depVal = dep[0] * 60 + +dep[1];
  // const arrVal = arr[0] * 60 + +arr[1];

  // // 到达时间相减得到分钟
  // let dis = arrVal - depVal;

  // // 如果是第二天凌晨时间段，需要加24小时
  // if (dis < 0) {
  //   dis = arrVal + 24 * 60 - depVal;
  // }

  // // 得到相差时间
  // return `${Math.floor(dis / 60)}时${dis % 60}分`;
}
