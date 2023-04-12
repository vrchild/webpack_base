import count from './js/count'
import sum from './js/sum'
// webpack要打包资源，我们首先要引入资源
import './css/iconfont.css'
import './css/base.css'
import './css/index.less'
import './css/index.sass'
import './css/index.scss'
import './css/index.styl'

const result = count(3, 5);
console.log(result)
console.log(sum(2,1,3,1))

if (module.hot) {
  // 判断是否支持热模块替换功能
  module.hot.accept("./js/count", function (count) {
    console.log('我修改了，你要做什么操作！！！', count)
  })
  module.hot.accept("./js/sum")
}
