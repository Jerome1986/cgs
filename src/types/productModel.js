/**
 * @typedef {Object} productModel - 商品信息
 * @property {string} _id -当前商品的id
 * @property {string} productType - 必填 - 商品类型，gold 金币充值  membership 会员
 * @property {string} productName - 必填 - 商品名称
 * @property {number} price - 必填 - 商品价格
 * @property {string} en_name - 商品英文名
 * @property {number} goldCoinsAmount - 购买的金币数量 默认0
 * @property {string} membershipType - 会员类型 annual-年费会员 permanent-永久会员
 * @property {number} dailyDownloadLimit - 下载次数 如 30次/天
 * @property {string} description - 必填 产品的详细描述或备注
 * @property {string} en_description - 英文描述
 * @property {boolean} isActive - 商品上架状态 默认true
 */
