const urls = [
  {
    title: '基础页面',
    name: 'base',
    show: true
  },
  {
    title: '光源',
    name: 'light',
    show: true
  },
  {
    title: '第三人称视角',
    name: 'cameraWalk',
    show: false
  },
  {
    title: '展开球体',
    name: 'expandSphere',
    show: true
  },
  {
    title: '发光球体',
    name: 'glow',
    show: true
  },
  {
    title: '拖拽移动调整大小旋转',
    name: 'moveResizeRotate',
    show: true
  }
];
const map = {};
urls.forEach((item) => {
  map[item.name] = `src/${item.name}/index.ts`;
});
export default {
  urls,
  map
};
