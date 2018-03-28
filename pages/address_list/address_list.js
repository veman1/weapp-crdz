const app = getApp()
Page({
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
	onShow: function () {
		this.loadData();
	},
	setDefault: function (e) {
		// 设置为默认地址
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 遍历所有地址对象设为非默认
		var addressObjects = that.data.addressObjects;
		for (var i = 0; i < addressObjects.length; i++) {
			// 判断是否为当前地址，是则传true
			addressObjects[i].is_default = i == index
		}

		var user_id = getApp().globalData.userInfo.user_id
		var address_id = addressObjects[index].address_id;
		 

    app.server.getJSON('/User/setDefaultAddress/user_id/' + user_id + "/address_id/" + address_id,function(res){
if(res.data.status == 1)
			{
				that.setData({
		    	addressObjects: addressObjects
		    });
			}
		 });
	},
	edit: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 取出id值
		var objectId = this.data.addressObjects[index].address_id;
		wx.navigateTo({
			url: '../edit/index?objectId='+objectId
		});
	},
	delete: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 找到当前地址AVObject对象
		var address = that.data.addressObjects[index];
		var user_id = getApp().globalData.userInfo.user_id
		var address_id = address.address_id;
		// 给出确认提示框
    
		wx.showModal({
			title: '确认',
			content: '要删除这个地址吗？',
			success: function(res) {
				if (res.confirm) {

          app.server.getJSON('/User/del_address/user_id/' + user_id + "/id/" + address_id,function(res){
 wx.showToast({
  				title: res.data.msg,
  				icon: 'success',
  				duration: 2000
  			});

				that.loadData();
						})
				}
			}
		})
		
	},
	loadData: function () {
		// 加载网络数据，获取地址列表
		var that = this;
		var user_id = getApp().globalData.userInfo.user_id
		
    app.server.getJSON('/User/getAddressList/user_id/' + user_id,function(res){
			var addressList = res.data.result;
			that.setData({
				addressObjects: addressList
			});
		});
	}
})