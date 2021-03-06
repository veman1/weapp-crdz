
// const host = 'https://yuantou.woshangapp.com/WXAPI'
// const host = 'https://chao.woshangfw.cn/WXAPI'

function __args() {
  var setting = {};
  if (arguments.length === 1 && typeof arguments[0] !== 'string') {
    setting = arguments[0];
  } else {
    setting.url = arguments[0];
    if (typeof arguments[1] === 'object') {
      setting.data = arguments[1];
      setting.success = arguments[2];
    } else {
      setting.success = arguments[1];
    }
  }
  if (setting.url.indexOf('http://') !== 0) {
    setting.url = this.host + setting.url;
  }
  return setting;
}
function __json(method, setting) {
  setting.method = method;
  setting.header = {
    'content-type': 'application/json'
  };
  wx.request(setting);
}

export default class {
  constructor(host) {
    this.host = host
  }
  getJSON () {
    __json('GET', __args.apply(this, arguments));
  }
  postJSON () {
    __json('POST', __args.apply(this, arguments));
  }
  sendTemplate (formId, templateData, success, fail) {
    var app = getApp();
    this.getJSON({
      url: '/WxAppApi/sendTemplate',
      data: {
        rd_session: app.rd_session,
        form_id: formId,
        data: templateData,
      },
      success: success,
      fail: fail
    });
  }
}

