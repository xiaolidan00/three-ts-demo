const urls = [
  {
    title: '基础页面',
    name: 'base'
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
