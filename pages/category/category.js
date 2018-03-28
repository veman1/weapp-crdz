const app = getApp()

app.Page({
  data: {
    goods: []
  },
  onShow() {
    if (app.globalData.category) {
      this.setData({
        category: app.globalData.category
      })
    } else {
      app.fetchCategory((clist) => {
        this.fetchGoods(clist[0].id, 0, 0, 0, true)
        this.setData({
          category: clist
        })
      })
    }
    if (app.globalData.categoryId !== this.data.categoryId) {
      this.fetchGoods(app.globalData.categoryId, 0, this.data.sort || 0, this.data.mode || 0, true)
    }
  },
  tapSort(e) {
    this.setData({
      sort: e.currentTarget.dataset.sort,
      mode: this.data.sort === e.currentTarget.dataset.sort ? (1 - this.data.mode) % 2 : 0,
    })
    this.fetchGoods(this.data.categoryId, 0, this.data.sort, this.data.mode, true)
  },
  tapCategory(e) {
    this.fetchGoods(e.currentTarget.dataset.cid, 0, this.data.sort || 0, this.data.mode || 0, true)
  },
  onReachBottom() {
    this.fetchGoods(this.data.categoryId, ++this.data.pageIndex, this.data.sort, this.data.mode)
  },

  /**
   * fetchGoods
   */
  fetchGoods(cid, pindex, sort, mode, clearGoods) {
    wx.showNavigationBarLoading()
    const sorts = ['sort', 'shop_price', 'sales_sum', 'on_time',]
    const modes = ['desc', 'asc']
    this.data.pageIndex = pindex
    this.data.sort = sort
    this.data.mode = mode
    this.setData({
      categoryId: cid
    })
    if (clearGoods) this.setData({ goods: [] })
    app.globalData.categoryId = cid
    app.server.getJSON({
      url: '/Goods/goodsList/id/' + cid + "/sort/" + sorts[sort] + "/sort_asc/" + modes[mode] + "/p/" + pindex,
      success: (res) => {
        wx.hideNavigationBarLoading()
        this.setData({
          goods: this.data.goods.concat(res.data.result.goods_list || [])
        })
      }
    })
  },
})
