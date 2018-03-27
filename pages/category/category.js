import Switcher from '../../modules/switcher'
const app = getApp()

app.Page({
  data: {
    goods: []
  },
  onLoad(o) {
    Switcher.init(this, 'catbar', null, e => {
      if (this.switchCategory(e.currentTarget.dataset.cid)) {
        this.fetchGoods(this.data.categoryId, 0, this.data.sort || 0, this.data.mode || 0)
        this.setData({ goods: [] })
      }
    })
    this.setData({
      category: app.globalData.category || []
    })
  },
  onShow() {
    if (this.switchCategory(this.data.categoryId)) {
      this.fetchGoods(this.data.categoryId, 0, this.data.sort || 0, this.data.mode || 0)
      this.setData({ 
        goods: [],
        pageIndex: 0,
      })
      this.data.pageIndex = 0
    }
  },
  tapSort(e) {
    this.setData({
      sort: e.currentTarget.dataset.sort,
      mode: this.data.sort === e.currentTarget.dataset.sort ? (1 - this.data.mode) % 2 : 0,
      goods: [],
    })
    this.fetchGoods(this.data.categoryId, 0, this.data.sort, this.data.mode)
  },
  tapCategory(e) {
    let cid = e.currentTarget.dataset.cid
    this.fetchGoods(cid, 0, this.data.sort || 0, this.data.mode || 0)
    app.globalData.categoryId = cid
    this.setData({
      categoryId: cid,
      goods: []
    })
  },
  onReachBottom() {
    this.fetchGoods(this.data.categoryId, ++this.data.pageIndex, this.data.sort, this.data.mode)
  },

  switchCategory(cid) {
    if (app.globalData.categoryId === cid) {
      return 0
    } else {
      this.setData({ categoryId: app.globalData.categoryId })
      return 1
    }
  },
  fetchGoods(cid, pindex, sort, mode) {
    const sorts = ['sort', 'shop_price', 'sales_sum', 'on_time',]
    const modes = ['desc', 'asc']
    this.data.pageIndex = pindex
    this.data.sort = sort
    this.data.mode = mode
    app.server.getJSON({
      url: '/Goods/goodsList/id/' + cid + "/sort/" + sorts[sort] + "/sort_asc/" + modes[mode] + "/p/" + pindex,
      success: (res) => {
        this.setData({
          goods: this.data.goods.concat(res.data.result.goods_list || [])
        })
      }
    })
  },
})
