/* eslint-disable */
(function (global, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);
  } else {
    global.VeScroll = factory();
  }
}(this, () => {
  const VeScroll = function (ele, options) {
    // off为true表示不响应拖动
    // 与此同时将会监听上划下划的操作
    // 上划触发options.goTop
    // 下划触发options.goDown
    // slideData记录与上下划动相关的数据
    this.off = false;
    const slideData = {};
    const defaults = {
    };

    const params = {};
    options = options || {};
    for (const key in defaults) {
      if (typeof options[key] !== 'undefined') {
        params[key] = options[key];
      } else {
        params[key] = defaults[key];
      }
    }

    const data = {
      distanceX: 0,
      distanceY: 0,
    };

    const win = window;

    const winWidth = win.innerWidth;
    const winHeight = win.innerHeight;

    if (!ele) {
      return;
    }

    // 设置transform坐标等方法
    const fnTranslate = function (x, y) {
      x = Math.round(1000 * x) / 1000;
      y = Math.round(1000 * y) / 1000;

      ele.style.webkitTransform = `translate(${[`${x}px`, `${y}px`].join(',')})`;
      ele.style.transform = `translate3d(${[`${x}px`, `${y}px`, 0].join(',')})`;
    };

    const scrollable = (el) => el.style.overflow === 'scroll' || el.style.overflowY === 'scroll';

    let strStoreDistance = '';
    // 居然有android机子不支持localStorage
    if (ele.id && win.localStorage && (strStoreDistance = localStorage[`VeScroll_${ele.id}`])) {
      const arrStoreDistance = strStoreDistance.split(',');
      ele.distanceX = +arrStoreDistance[0];
      ele.distanceY = +arrStoreDistance[1];
      fnTranslate(ele.distanceX, ele.distanceY);
    }

    // 显示拖拽元素
    ele.style.visibility = 'visible';

    // 如果元素在屏幕之外，位置使用初始值
    const initBound = ele.getBoundingClientRect();

    if (initBound.left < -0.5 * initBound.width ||
      initBound.top < -0.5 * initBound.height ||
      initBound.right > winWidth + 0.5 * initBound.width ||
      initBound.bottom > winHeight + 0.5 * initBound.height
    ) {
      ele.distanceX = 0;
      ele.distanceY = 0;
      fnTranslate(0, 0);
    }

    ele.addEventListener('touchstart', (event) => {
      let events = event.touches[0] || event;
      let cTarget = events.target;
      data.cTarget = null;
      let ccTarget = null;
      while(true){
        if(scrollable(cTarget)){
          ccTarget = cTarget;
          break;
        }else if(cTarget === ele){
          break;
        }else{
          cTarget = cTarget.parentNode;
        }
      }

      if(this.off){
        slideData.done = false;
        slideData.cTarget = null;
        slideData.posY = events.pageY;
        slideData.nowY = events.pageY;
        if(ccTarget){
          slideData.cTarget = ccTarget;
        }
        return;
      }
      if(ccTarget){
        data.cTarget = ccTarget;
        data.cTargetScrollTop = ccTarget.scrollTop
      }

      if (data.edgeing || data.touching) return;
      data.touching = true;
      data.posX = events.pageX;
      data.posY = events.pageY;
      data.nowX = events.pageX;
      data.nowY = events.pageY;
      data.hei = null;


      if (ele.distanceX) {
        data.distanceX = ele.distanceX;
      }
      if (ele.distanceY) {
        data.distanceY = ele.distanceY;
      }

      // 元素的位置数据
      data.bound = ele.getBoundingClientRect();

      data.timerready = true;
    });

    const easeOutQuad = function (t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    };
    const edge = function (changeValue) {
      data.edgeing = true;
      // 时间
      var start = 0,
        during = 15;
      // 初始值和变化量
      var init = ele.distanceY;

      var run = function () {
        // 如果用户触摸元素，停止继续动画
        if (data.touching == true) {
          data.inertiaing = false;
          return;
        }

        start++;
        var y = easeOutQuad(start, init, changeValue, during);
        fnTranslate(0, y);
        if (start < during) {
          requestAnimationFrame(run);
          if (during - start < 3) {
            data.edgeing = false;
          }
        } else {
          data.edgeing = false;
          ele.distanceY = y;
          data.inertiaing = false;
          if (win.localStorage) {
            localStorage['VeScroll_' + ele.id] = [y].join();
          }
        }
      };
      run();
    };

    // 移动
    ele.addEventListener('touchmove', (event) => {
      let events = event.touches[0] || event;
      if(this.off){
        slideData.nowY = events.pageY;
        if(slideData.cTarget === null)event.preventDefault();
        return;
      }
      // return false;
      if (data.touching !== true) {
        return;
      }

      data.nowX = events.pageX;
      data.nowY = events.pageY;

      let distanceX = data.nowX - data.posX,
        distanceY = data.nowY - data.posY;
      let offsetY = 0;
      if(data.cTarget){
        if(distanceY > 0){ // 向下
          if(data.cTarget.scrollTop > 0){
            return;
          }
          offsetY = -data.cTargetScrollTop;
        } else if(distanceY < 0) { // 向上
          if(data.cTarget.scrollTop + data.cTarget.clientHeight < data.cTarget.scrollHeight){
            return;
          }
          offsetY = data.cTarget.scrollTop - data.cTargetScrollTop;
        }
      }
      distanceY += offsetY; // 修复由于内部滚动引起的distanceY计算偏差
      event.preventDefault();
      // 当移动开始的时候开始记录时间
      if (data.timerready == true) {
        data.timerstart = +new Date();
        data.timerready = false;
      }
      let absTop = 0;
      let bound = ele.getBoundingClientRect();
      let x = 0,
        y = 0;
      if (bound.bottom <= winHeight) {
        data.hei = data.hei || distanceY;
        y = data.bound.top + data.hei + ((distanceY - data.hei) / 3.5);
      } else {
        y = data.bound.top + distanceY;
      }
      options.topOver(bound.height > winHeight ? bound.y : 1);
      // 此时元素的位置
      // 元素位置跟随
      fnTranslate(x, y);

      // 缓存移动位置
      ele.distanceX = x;
      ele.distanceY = y;
    }, { // fix #3 #5
        passive: false,
      });

    // touch结束
    document.addEventListener('touchend', () => {
      if(this.off){
        // console.log('touchend')
        const slideOffset = slideData.nowY - slideData.posY;
        if(isNaN(slideOffset) || slideData.cTarget){
          return;
        }
        if(slideOffset < -30){
          // 上划
          options.goTop && options.goTop();
        } else if(slideOffset > 30){
          // 下划
          options.goDown && options.goDown();
        }
        slideData.nowY = null;
        slideData.posY = null;
        return;
      }
      // return
      if (data.touching === false) {
        // fix iOS fixed bug
        return;
      }
      data.touching = false;
      // 计算速度
      data.timerend = +new Date();

      if (!data.nowX || !data.nowY) {
        return;
      }

      // 移动的水平和垂直距离
      let distanceX = data.nowX - data.posX,
        distanceY = data.nowY - data.posY;
      if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
        return;
      }

      // 距离和时间
      let distance = Math.sqrt(0 + distanceY * distanceY),
        time = data.timerend - data.timerstart;

      // 速度，每一个自然刷新此时移动的距离
      let speed = distance / time * 19.666;

      // 经测试，2~60多px不等
      // 设置衰减速率
      // 数值越小，衰减越快
      let rate = Math.min(10, speed);

      // 开始惯性缓动
      data.inertiaing = true;

      var step = function () {
        if (data.touching == true) {
          data.inertiaing = false;
          return;
        }
        speed -= speed / rate;
        // 此时元素的各个数值
        let bound = ele.getBoundingClientRect();
        options.topOver(bound.height > winHeight ? bound.y : 1);
        // 根据运动角度，分配给x, y方向
        let moveX = speed * distanceX / distance,
          moveY = speed * distanceY / distance;

        if (moveY < 0 && bound.bottom + moveY < winHeight) {
          // 到底部
          moveY = winHeight - bound.bottom;
          edge(moveY)
          return false;
        } else if (moveY > 0 && bound.top + moveY > winHeight - ele.initHeight) {
          // 到初始值
          moveY = winHeight - ele.initHeight - bound.top;
          edge(moveY)
          return false;
        }

        let x = ele.distanceX + moveX,
          y = ele.distanceY + moveY;
        // console.log(`
        // ele.distanceY: ${ele.distanceY}
        // moveY: ${moveY}
        // y: ${y}
        // speed: ${speed}
        // bound.bottom: ${bound.bottom}
        // bound.top: ${bound.top}
        // `)
        // 位置变化
        fnTranslate(0, y);

        ele.distanceX = x;
        ele.distanceY = y;

        if (speed < 0.1) {
          speed = 0;
          data.inertiaing = false;

          if (win.localStorage) {
            localStorage[`VeScroll_${ele.id}`] = [x, y].join();
          }
        } else {
          requestAnimationFrame(step);
        }
      };

      step();
    });
  };

  return VeScroll;
}));
