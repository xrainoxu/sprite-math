// 将 Level 4 媒体查询语法转换为传统语法的 PostCSS 插件
// 注意：esbuild 作为 minifier 时不需要此插件，但保留作为备用
const fixMediaQueries = {
  postcssPlugin: 'fix-media-queries',
  Once(root) {
    root.walkAtRules('media', (atRule) => {
      atRule.params = atRule.params.replace(/\(width>=\d+px\)/g, (match) => {
        const num = match.match(/\d+/)[0];
        return `(min-width: ${num}px)`;
      });
      atRule.params = atRule.params.replace(/\(width<\d+px\)/g, (match) => {
        const num = match.match(/\d+/)[0];
        return `(max-width: ${num}px)`;
      });
    });
  }
};

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    fixMediaQueries,
  ],
}
