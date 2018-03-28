var server = require('../../utils/server.js');

Page({
  data: {
    page_index: 0,
    loading_show: false,
    list: [
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png',
          '/testImg/test.png',
          '/testImg/test.png',
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
      {
        user_name: 'user name',
        ava: '/testImg/test.png',
        content: '特别好特别好特别好特别好特别好特别好',
        time: '2017-07-12 00:00:00',
        hasImgs: 1,
        imgs: [
          '/testImg/test.png'
        ],
      },
    ],
  },

  onLoad: function (options) {

  },

  clickCommentImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: e.currentTarget.dataset.urls,
    })
  },

  toTopTap: function () {
    wx.pageScrollTo({ scrollTop: 0 })
  },

  onReachBottom: function () {
    this.setData({ loading_show: true });
  },
})