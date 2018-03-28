const app = getApp()

app.Page({
  data: {
    carousel: app._data.carousel,
    category: app._data.category,
    goods_group: app._data.goods,
    goods: app._data.goods,
  },
  onLoad(o) {
    app.server.getJSON('/Index/home', (res) => {
      this.setData({
        data: res.data
      })
    })
  },
  onShow() {
    if (app.globalData.category) {
      this.setData({
        category: app.globalData.category
      })
    } else {
      app.fetchCategory((clist) => {
        this.setData({
          category: clist
        })
      })
    }
  },
  chooseCategory(e) {
    app.globalData.categoryId = e.currentTarget.dataset.cid
    wx.switchTab({
      url: '/pages/category/category',
    })
  },
})
