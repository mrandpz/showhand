/**
 * **路由功能基础函数**
 * @author 王刚(Margox Wang)
 * @date 2019-05-08
 */

export const isPathMatch = (path, strict = false) => {
  return path && strict ? path === location.pathname : location.pathname.indexOf(path) === 0
}

export const redirectTo = () => {}
