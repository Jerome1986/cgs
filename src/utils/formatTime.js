// formatTime.js

/**
 * 格式化时间
 * @param {Date|string|number} date - 需要格式化的日期对象、时间字符串或时间戳
 * @param {string} format - 格式化字符串，默认是 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  // 如果 date 是字符串或数字，先转换为 Date 对象
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }

  // 检查是否是有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
