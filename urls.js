const urls = [
  {
    title: '基础页面',
    name: 'base',
    show: true
  },
  {
    title: '第三人称视角',
    name: 'cameraWalk',
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
