var server = require('../../../utils/server.js');

(function () {

  // @ 函数： 计算剩余时间（返回值格式： '18:18:18'）
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

  // # 初始数据
  var data = {
    goods: {
      gallery: [],
      name: '',
      price: '',
      endTime: '',
    },
    group_members_expect: 0,
    group_members: [],
    remain_time: '',
    arr: [],
    isLeader: 0,
  };

  Page({
    data: data,

    onLoad: function (options) {
      console.log(this.route);
      var teamid = options.id;
      var order_id = options.order_id ? options.order_id : 0;
      

      var user_id;
      if (getApp().globalData.userInfo) {
        user_id = getApp().globalData.userInfo.user_id;
      }

      var that = this;
      if (user_id) {
        this._loadData(teamid, order_id, user_id);
      } else {
        console.log('重新登录');
        getApp().login(function () {
          user_id = getApp().globalData.userInfo.user_id;
          that._loadData(teamid, order_id, user_id);
        })
      }


      this.setData({
        order_id: order_id,
        teamid: teamid,
      })
    },

    _loadData: function (teamid, order_id, user_id) {
      var that = this;
      server.getJSON('/Group/groupDetail/user_id/' + user_id + "/teamid/" + teamid + '/order_id/' + order_id, function (res) {
        var loadData = res.data.result;
        var numarr = [];

        for (var i = 0; i < loadData.goods.groupnum - 1 - loadData.teamid_lists.length; i++) {
          numarr[i] = i;
        }
        loadData.goods.numarr = numarr

        that.setData({
          loadData: loadData,
          user_id: user_id,
        });

        that.setCountDown();
      });
    },
    setCountDown: function () {//倒计时
      var endTime = this.data.loadData.goods.grouptime;
      var that = this;
      setInterval(function () {
        that.setData({
          remain_time: calRemainTime(endTime),
        });
      }, 1000);
    },

    clickJoin: function () {//点击参团
      var teamid = this.data.loadData.goods.teamid
      var goods_id = this.data.loadData.goods.goodid
      wx.redirectTo({
        url: '/pages/group_order_submit/group_order_submit?heads=0&goods_id=' + goods_id + '&type=groups&teamid=' + teamid,
      });
    },

    clickToHome: function () {//点击返回首页
      wx.switchTab({
        url: '/pages/index/index',
      });
    },

    onShareAppMessage: function (res) {//转发
      // 获得加载的数据
      var loadData = this.data.loadData;

      // 计算成团缺少人数
      var poor = parseInt(loadData.goods.groupnum) - 1 - loadData.teamid_lists.length;

      // 价格
      var price = loadData.goods.groupsprice;

      // 商品名称
      var goodsName = loadData.goods.title;

      // 订单ID
      var order_id = this.order_id;

      // 拼团ID
      var id = this.data.teamid

      return {
        title: '还差' + poor + '人，我' + price + '元团了' + goodsName + '！',
        imageUrl: loadData.goods.gallery[0],
        path: '/pages/group_order_detail/group_order_detail?order_id=' + order_id + '&id=' + id,
      };
    },

  });

})();

