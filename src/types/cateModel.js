/**
 * @typedef {Object} cateModel - 分类信息
 * @property {string} _id -当前分类的id
 * @property {string} name - 分类名称
 * @property {string} en_name - 分类英文名
 * @property {string|null} parent_id - 父级分类ID，如果没有父级则为null
 * @property {string|null } parent_name -父级名称
 * @property {string} type - 分类所属类型（例如：模型分类、贴图分类等）
 * @property {Array} subCategories - 二级分类
 */
