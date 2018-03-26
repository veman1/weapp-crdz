import Switcher from '../../modules/switcher'
const app = getApp()
var categoryId
var gsort = "shop_price";
var asc = "desc";

app.Page({
  data: {
    goods: app._data.goods,
    categoryId: '1',
    sortStatus: [0, 0],
    sort: [
      ['sort-asc'],
      ['shop_price-desc', 'shop_price-asc'],
      ['sales_sum-desc', 'sales_sum-asc'],
      ['on_time-desc', 'on_time-asc'],
    ],
  },
  onLoad(o) {
    Switcher.init(this, 'catbar', app._data.category, e => {
      this.switchCategory(e.currentTarget.dataset.index)
    })      
    categoryId = o.categoryId;
    // this.getGoods(categoryId, 0, this.data.sort[0][0]);
  },
  onShow() {
    this.switchCategory(app.globalData.category.current)
  },

  tapMainMenu: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var sortStatus = this.data.sortStatus;
    if (sortStatus[0] !== index) {
      sortStatus = [index, 0]
    } else {
      sortStatus[1] = sortStatus[1] == 0 ? 1 : 0;
    }
    this.setData({
      goods: [],
      sortStatus: sortStatus,
      tab: index,
      filterShown: false,
      maskShown: false
    });
    if (!keywords)
      this.getGoods(categoryId, 0, this.data.sort[sortStatus[0]][sortStatus[1]]);
    else
      this.getGoodsByKeywords(keywords, 0, this.data.sort[index]);
  },
  // tapMainMenu: function (e) {
  //   var index = parseInt(e.currentTarget.dataset.index);
  //   var sortStatus = this.data.sortStatus;
  //   var sort = this.data.sort[sortStatus[0]][sortStatus[1]]
  //   var sort_mode = sort.split('-')[0]
  //   var sort_asc = sort.split('-')[1]
  //   if (sortStatus[0] !== index) {
  //     sortStatus = [index, 0]
  //   } else {
  //     sortStatus[1] = sortStatus[1] == 0 ? 1 : 0;
  //   }
  //   this.setData({
  //     sortStatus: sortStatus,
  //     tab: index,
  //     filterShown: false,
  //     maskShown: false
  //   });
  //   this.fetchGoods(this.data.categoryId, 0, sort_mode, sort_asc, (res) => {
  //     this.setData({
  //       goods: res.data.reult.goods_list
  //     })
  //   });
  // },
  switchCategory(current) {
    current !== this.data.catbar.current && app.switchCategory(current, () => {
      this.$switcherSwitch(current)      
      this.getGoods(categoryId, 0, this.data.sort[sortStatus[0]][sortStatus[1]])
    })
  },

  getGoods: function (category, pageIndex, sort) {
    console.log('sort:', sort);
    var that = this;
    var sortArray = sort.split('-');
    gsort = sortArray[0];
    asc = sortArray[1];
    app.server.getJSON('/Goods/goodsList/id/' + category + "/sort/" + sortArray[0] + "/sort_asc/" + sortArray[1] + "/p/" + pageIndex, function (res) {
      var res = res;
      console.log('res:', res);
      // success
      var newgoods = res.data.result.goods_list

      var ms = that.data.goods
      for (var i in newgoods) {
        ms.push(newgoods[i]);
      }

      if (ms.length == 0) {
        that.setData({
          empty: true
        });
      }
      else
        that.setData({
          empty: false
        });
      // wx.stopPullDownRefresh();

      that.setData({
        goods: ms,
        loding: false
      });

      // wx.setNavigationBarTitle({
      //   title: res.data.result.catename
      // });
    });

  },
  // fetchGoods(categoryId, pageIndex, sort, sort_asc, success = () => {}) {
  //   app.server.getJSON({
  //     url: '/Goods/goodsList/id/' + categoryId + "/sort/" + sort + "/sort_asc/" + sort_asc + "/p/" + pageIndex,
  //     success: (res) => {
  //       success(res)
  //     }
  //   })
  // },
})
