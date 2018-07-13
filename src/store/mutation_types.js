/**
 * Created by Administrator on 2018/7/11.
 */
/**
 * 使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。
 * 这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
 */
const mutation_names={
  LOADING_OPEN:'loading_open',
  LOADING_CLOSE:'loading_close'
};
export default mutation_names
