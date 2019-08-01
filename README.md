# vue-didi

## 模仿滴滴首页底部滑动菜单栏

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## knowLedge
1. vue-cli3适配解决方案[https://my.oschina.net/u/2006685/blog/1941953]
2. 滴滴ui库 cube-ui  `vue add cube-ui`
3. anime库要用2.2版本的， 3.1的开关滑动菜单的时候出现一些问题

## 遇到坑
1. vue-cli3对umd规范的支持并不理想，需要在babel.config.js中去配置ignore: ["./src/utils/dragScroll.js"]，不然会报错，ps：可能旧版本兼容
2. postcss-px2rem-exclude    注释/*no*/可以禁止自动px转换rem