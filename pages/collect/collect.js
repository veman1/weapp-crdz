const app = getApp()
var cPage = 0;
Page({
  data: {
    isLoading: false,
    noMore: false,
    orders: [],
    collects: [],
    tabClasss: ["text-select", "text-normal", "text-normal", "text-normal", "text-normal"],
  },
  details: function (e) {
    var objectId = e.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: "../../goods/detail/detail?objectId=" + objectId
    });
  },
  deleteGoods: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定删除该收藏吗？',
      success: function (res) {
        if (res.confirm) {
          var user_id = getApp().globalData.userInfo.user_id
          var goods_id = e.currentTarget.dataset.goodsId;;
          var ctype = 1;
          app.server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function (res) {
            wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
            cPage = 0;
            that.data.collects = [];
            that.getCollectLists(0);
          });
        }
      }
    })
  },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
  },

  onReachBottom: function () {
    this.getCollectLists(++cPage);
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading'
    // })
  },
  onPullDownRefresh: function () {
    cPage = 0;

    this.onReachBottom = function () {
      this.getCollectLists(++cPage);
    };

    this.setData({
      collects: []
    });

    // this.data.collects = [];
    this.getCollectLists(0);

  },


  getCollectLists: function (page) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id

    this.setData({isLoading:true});

    app.server.getJSON('/User/getGoodsCollect/user_id/' + user_id + "/page/" + page, function (res) {
      console.log('responsed');
      var datas = res.data.result;
      if (datas.length==0) {
        that.setData({noMore:true});
        that.onReachBottom = function () {
          // that.getCollectLists(++cPage);
        };
      }

      var ms = that.data.collects
      for (var i in datas) {
        ms.push(datas[i]);
      }

      wx.stopPullDownRefresh();
      that.setData({
        collects: ms,
        isLoading: false
      });

    });
  },
  onLoad: function () {

    cPage = 0;
    this.getCollectLists(0);

    return;

  }
});