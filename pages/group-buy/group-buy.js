const app = getApp()
app.Page({
  data: {
    loding: false
  },
  onLoad: function (options) {
    this._loadData();
    this.getUserId()
  },

  getUserId() {
    app.globalData.userInfo && this.setData({
      user_id: app.globalData.userInfo.user_id || ''      
    })
  },

  _loadData: function () {
    var that = this;
    app.server.getJSON('/Group/grouplist', function (res) {
      that.setData({
        lists: res.data.result
      })
    });
  },

  toTopTap: function () {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

});