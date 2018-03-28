import PageConfig from 'config/PageConfig'
import Server from 'utils/server'
import _data from '_data/_data'

App({
  globalData: {},
  _data,
  onLaunch() {
    this.getOpenId()
  },
  server: new Server('https://chao.woshangfw.cn/WXAPI'),

  Page(obj) {
    Page(new PageConfig(obj))
  },

  modal(title) {
    wx.showModal({
      title,
      showCancel: false
    })
  },

  getOpenId() {
    wx.login({
      success: (res) => {
        this.server.getJSON("/User/getOpenid", {
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa8e41431b1d907e9&secret=e512a9e242fb95be038715afac3fc310&js_code=' + res.code + '&grant_type=authorization_code&code=' + res.code
        }, (res) => {
          var openId = res.data.openid;
          var unionid = res.data.unionid;

          this.globalData.openid = openId;
          this.globalData.unionid = unionid;

          openId && this.validateOpenid(openId)
        });
      },
      fail(res) {
        console.log('微信登录失败')
      }
    });
  },

  validateOpenid(openid) {
    this.server.getJSON("/User/validateOpenid", { openid: openid }, (res) => {
      if (res.data.code == 200) {
        this.globalData['userInfo'] = res.data.data;
        this.globalData.login = true;
      } else {
        if (res.data.code == '400') {
          this.register(openid)
        }
      }
    });
  },

  register(openid) {
    var app = this;
    wx.getUserInfo({
      success({userInfo}) {
        app.server.getJSON('/User/register', {
          open_id: openid,
          country: userInfo.country,
          gender: userInfo.gender,
          nick_name: userInfo.nickName,
          province: userInfo.province,
          city: userInfo.city,
          head_pic: userInfo.avatarUrl,
          fid: app.globalData.fid ? app.globalData.fid : '0',
          unionid: app.globalData.unionid
        }, (res) => {
          app.globalData.userInfo = res.data.res
          app.globalData.login = true
        })
      }
    })
  },

  fetchCategory(succ) {
    wx.showLoading()
    this.server.getJSON('/Goods/goodsCategoryList?parent_id=84', (res) => {
      wx.hideLoading()
      this.globalData.category = res.data.result
      this.globalData.categoryId = res.data.result[0].id
      succ && succ(res.data.result)
    });
  }

})
