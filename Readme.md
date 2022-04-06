# 这是一个基于 vue2 的滚动条解决方案

## 一、打包

```js
npm run build
```

## 二、使用

```js
npm i story-scrollbar -S

或

yarn add story-scrollbar
```

```js
// main.js
// 这是一个基于vue2的scrollbar解决方案，所以建议在vue2环境下使用
import SScrollbar from "story-scrollbar";

Vue.use(SScrollbar);
```

```vue
<template>
  <SScrollbar>
    <!--content-->
  </SScrollbar>
</template>
```
