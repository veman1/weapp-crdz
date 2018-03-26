
const data = {
}

/**
 * 默认转发
 */
function onShareAppMessage() {
    return {
        title: '潮人订制',
        path: '/pages/index/index'
    }
}

/**
 * 页面滚动到顶部
 */
function pageToTop() {
    wx.pageScrollTo({
        scrollTop: 0,
    })
}

const methods = {
    onShareAppMessage,
    pageToTop
}




export default class PageConfig {
    constructor(obj) {
        Object.assign(this, {data:{}}, methods, obj)
        Object.assign(this.data, data)
    }
}