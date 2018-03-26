const app = getApp()

app.Page({
  data: {
    carousel: app._data.carousel,
    category: app._data.category,
    goods_group: app._data.goods,
    goods: app._data.goods,
  },
  onLoad(o) {
    app.server.getJSON('/Index/home', ({ data }) => {
      this.setData({data})
    })
  },
  switchCategory(e) {
    let current = e.currentTarget.dataset.index
    app.switchCategory(current, () => {
      wx.switchTab({
        url: '/pages/category/category',
      })
    })
  },
})
