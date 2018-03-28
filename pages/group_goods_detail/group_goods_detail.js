const app = getApp()
var wxParse = require('../../utils/wxParse/wxParse.js')

// @ 函数： 时间戳转换时间字符串 （格式： '18:18:18'）
function calRemainTime(timestamp) {
  var EndTime = new Date(timestamp);
  var NowTime = new Date();
  var t = EndTime.getTime() - NowTime.getTime();
  var d = 0;
  var h = 0;
  var m = 0;
  var s = 0;
  if (t >= 0) {
    d = Math.floor(t / 1000 / 60 / 60 / 24);
    h = Math.floor(t / 1000 / 60 / 60 % 24) + 24 * d;
    m = Math.floor(t / 1000 / 60 % 60);
    s = Math.floor(t / 1000 % 60);
  }

  var str = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);

  return str;
}

// @ 设置倒计时
function setCountdown(PAGE) {
  setInterval(function () {
    var group = PAGE.data.group;
    for (var i in group) {
      var stamp = group[i].grouptime;
      group[i].remainTimeStr = calRemainTime(stamp);
    }
    PAGE.setData({
      group: group,
    });
  }, 1000);
}

app.Page({
  data: {
    popup_show: false,
    goods: {},
    goods_num: 1,
    collected: false,
  },
  onLoad: function (options) {
    var goods_id = options.goods_id;
    // var user_id = options.user_id;
    var user_id = 6;
    this.getGoodsById(goods_id, user_id);
  },
  propClick: function (e) {
    var pos = e.currentTarget.dataset.pos;
    var index = e.currentTarget.dataset.index;
    var goods = this.data.goods
    for (var i = 0; i < goods.goods.goods_spec_list[index].length; i++) {
      if (i == pos)
        goods.goods.goods_spec_list[index][pos].isClick = 1;
      else
        goods.goods.goods_spec_list[index][i].isClick = 0;
    }
    this.setData({ goods: goods });
    this.checkPrice();
  },
  addCollect: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    var user_id = getApp().globalData.userInfo.user_id
    var ctype = 0;
    var that = this;
    app.server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function (res) {
      if (res.data.status == 1) {
        that.setData({ collected: true });
      }
      wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
    });
  },
  bindMinus: function (e) {
    var num = this.data.goods_num;
    if (num > 1) {
      num--;
    }
    this.setData({ goods_num: num });
  },
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({ goods_num: num });
  },
  bindPlus: function (e) {
    var num = this.data.goods_num;
    num++;
    this.setData({ goods_num: num });
  },
  getGoodsById: function (goodsId, user_id) {
    var that = this;
    app.server.getJSON('/Group/goodsInfo/id/' + goodsId + '/user_id/' + user_id, function (res) {
      var goodsInfo = res.data.result;
      // console.info(goodsInfo.goods.content)
      that.setData({
        goods: goodsInfo,
        group: res.data.result.group
      });

      // 开始倒计时
      setCountdown(that);

      wxParse.wxParse('detail', 'html', goodsInfo.goods.content, that, 5);
      that.checkPrice();
    });
  },
  checkPrice: function () {
    var goods = this.data.goods;
    var spec = ""
    this.setData({ price: goods.goods.shop_price });
    if (!goods.goods.goods_spec_list) return false;
    for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
      for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
        if (goods.goods.goods_spec_list[i][j].isClick == 1) {
          if (spec == "")
            spec = goods.goods.goods_spec_list[i][j].item_id
          else
            spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
        }
      }
    }
    var specs = spec.split("_");
    for (var i = 0; i < specs.length; i++) {
      specs[i] = parseInt(specs[i])
    }
    specs.sort(function (a, b) { return a - b });
    spec = ""
    for (var i = 0; i < specs.length; i++) {
      if (spec == "")
        spec = specs[i]
      else
        spec = spec + "_" + specs[i]
    }
    var price = goods['spec_goods_price'][spec].price;
    this.setData({ price: price });
  },
  buy: function () {
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid
    var goods_num = that.data.goods_num;
    if (app.globalData.login)
      var user_id = app.globalData.userInfo.user_id;
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 10000
    });
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      console.log('res:', res);
      if (res.data.status == 1) {
        app.server.getJSON('/Cart/updateAllSelect/open_id/' + session_id + "/selected/" + false, function (res) {
          app.server.getJSON('/Cart/cartList/session_id/' + session_id, { user_id: user_id }, function (res) {
            var carts = res.data;
            var id = carts[carts.length - 1].id;
            app.server.getJSON('/Cart/updateSelect/id/' + id + "/selected/1", function (res) {
              wx.hideToast();
              wx.switchTab({
                url: '/pages/cart/cart',
              });
            });
          });
        });
      }
      else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 2000
        });
    });
    return;
  },
  toTopTap: function () {
    wx.pageScrollTo({ scrollTop: 0 });
  },
  clickCommentImg: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
    });
  },
  clickCollect: function () {
    this.setData({ isCollect: !this.data.isCollect });
  },
  clickToCart: function () {
    wx.showModal({
      title: '是否跳到购物车？',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        }
      }
    })
  },
  //单独购买
  clickBottomBuy: function () {
    var goods = this.data.goods
    wx.navigateTo({
      url: '/pages/group_order_submit/group_order_submit?goods_id=' + goods.goods.id + "&type=single",
    });
  },
  //多人拼团
  clickBottomGroup: function () {
    var goods = this.data.goods
    wx.navigateTo({
      url: '/pages/group_order_submit/group_order_submit?heads=1&goods_id=' + goods.goods.id + "&type=groups",
    });
  },
  // 加入购物车
  clickPopupAddCart: function () {
    this.setData({
      popup_show: false
    });
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var app = getApp()
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid//that.data.goods.goods.spec_goods_price
    var goods_num = that.data.goods_num;
    var user_id = "0"
    if (app.globalData.login)
      user_id = app.globalData.userInfo.user_id
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      if (res.data.status == 1)
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1000
        });
      else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        });
    });
  },
  clickPopupBuy: function () {
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var app = getApp()
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid//that.data.goods.goods.spec_goods_price
    var goods_num = that.data.goods_num;
    var user_id = "0"
    if (app.globalData.login)
      user_id = app.globalData.userInfo.user_id
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      if (res.data.status == 1) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../../cart/cart'
        });
      }
      else
        wx.showToast({
          title: res.data.msg,
          image: '/images/error.png',
          duration: 2000
        });
    });
    return;
    this.setData({
      popup_show: false
    });
  },
  // ！ 点击弹窗里面的拼团
  clickPopupGroup: function () {
    wx.navigateTo({
      url: '/pages/order_submit/order_submit',
    });
  },
  clickMask: function () {
    this.setData({ popup_show: false });
  },
  clickSelectedBar: function () {
    this.setData({ popup_show: true });
  },
  clickPopupClose: function () {
    this.setData({ popup_show: false });
  },
  clickMoreComments: function () {
    wx.navigateTo({
      url: '/pages/group_goods_detail_comment/group_goods_detail_comment?id=',
    });
  },

  clickToGroup: function (e) {
    var teamid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/group_order_detail/group_order_detail?heads=0&id=' + teamid,
    });
  },

});
