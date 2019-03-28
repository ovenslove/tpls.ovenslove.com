const utils = require('./utils');
const mapUtils = require('./utils.map');
/**
 *@function 地址
 *
 */
function Address() {
    this.version = '0.0.1';
    this.init = function ({
        ak,
        service
    }) {
        this.ak = ak;
        this.service = service || 'baidu';
        this.id = utils.randomString();
    };
}

/***
 * @function 获取定位信息
 * @param {String} type 定位类型ip/gps
 * @param {Boolean} cache 是否缓存地址
 * @returns {Object} 返回地址信息
 */
Address.prototype.getLocation = function getLocation({
    type = 'ip',
    cache = false
} = {}) {
    let location,
        that = this;
    if (type === 'ip') {
        location = this.getLocationByIP();
    } else {
        location = this.getLocationByGps();
    }
    if (cache) {
        location.then(data => {
            wx.setStorage({
                key: 'locationCache_tmp',
                data: JSON.stringify(data),
                success: (result) => {},
                fail: () => {},
                complete: () => {}
            });
        })
    }
    return location;
};
/***
 * @function 获取定位信息-IP
 * @returns {Object} 返回地址信息
 */
Address.prototype.getLocationByIP = function getLocationByIP() {
    let that = this;
    return new Promise((resolve, reject) => {
        if (!this.ak) {
            throw new Error('ak为空')
        };
        if (that.service === 'baidu') {
            wx.request({
                url: 'https://api.map.baidu.com/location/ip',
                method: 'GET',
                data: {
                    ak: this.ak,
                    coor: 'bd09ll'
                },
                success(data) {
                    let _location = data.data.content;
                    let d = {};
                    d.longitude = _location.point.x; // 经度
                    d.latitude = _location.point.y; // 纬度
                    d.address = _location.address; // 合并地址
                    d.country = ''; // 国家
                    d.cityCode = _location.address_detail.city_code; // 城市code
                    d.adCode = 0;
                    d.province = _location.address_detail.province; // 省份
                    d.city = _location.address_detail.city; // 城市
                    d.district = _location.address_detail.district; // 区县
                    d.street = _location.address_detail.street; // 街道
                    d.description = '';
                    d.originData = _location;
                    resolve(d);
                },
                fail(err) {
                    reject(err);
                },
                complete() {}
            })
        } else {
            wx.request({
                url: 'https://apis.map.qq.com/ws/location/v1/ip',
                method: 'GET',
                data: {
                    key: this.ak,
                    output: 'json'
                },
                success(data) {
                    let _location = data.data.result;
                    let d = {};
                    d.longitude = _location.location.lng; // 经度
                    d.latitude = _location.location.lat; // 纬度
                    d.country = _location.ad_info.nation; // 国家
                    d.cityCode = 0; // 城市code
                    d.adCode = _location.ad_info.adcode;
                    d.province = _location.ad_info.province; // 省份
                    d.city = _location.ad_info.city; // 城市
                    d.district = _location.ad_info.district; // 区县
                    d.street = ''; // 街道
                    d.description = '';
                    d.address = _location.address || d.province + d.city + d.district + d.street; // 合并地址
                    d.originData = _location;
                    console.log(_location)
                    resolve(d);
                },
                fail(err) {
                    reject(err);
                },
                complete() {}
            })
        }

    });
}
/***
 * @function 获取定位信息-GPS
 * @returns {Object} 返回地址信息
 */
Address.prototype.getLocationByGps = function getLocationByGps() {
    let that = this;
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            altitude: false,
            success(data) {
                let longitude = data.longitude;
                let latitude = data.latitude;
                if (that.service === 'baidu') {
                    let exLocation = mapUtils.gcj02tobd09(longitude, latitude);
                    resolve(that.decodeAddressByBaidu(exLocation[0], exLocation[1]));
                } else {
                    resolve(that.decodeAddressByQQ(longitude, latitude));
                }
            },
            fail(err) {
                reject(err);
            },
            complete() {}
        });
    });
}

/***
 * @function 地址反查-baidu
 * @param {Number} longitude 经度
 * @param {Number} latitude 纬度
 * @returns {Object} 返回地址信息
 */
Address.prototype.decodeAddressByBaidu = function decodeAddressByBaidu(longitude, latitude) {
    return new Promise((resolve, reject) => {
        if (!this.ak) {
            throw new Error('ak为空')
        };
        wx.request({
            url: 'http://api.map.baidu.com/geocoder/v2/',
            method: 'GET',
            data: {
                ak: this.ak,
                location: latitude + ',' + longitude,
                coordtype: 'bd09ll',
                ret_coordtype: 'bd09ll',
                pois: 0,
                output: 'json'
            },
            success(data) {
                let _location = data.data.result;
                let d = {};
                d.longitude = _location.location.lng; // 经度
                d.latitude = _location.location.lat; // 纬度
                d.address = _location.formatted_address; // 合并地址
                d.cityCode = _location.cityCode; // 城市code
                d.adCode = _location.addressComponent.adcode;
                d.country = _location.addressComponent.country; // 国家
                d.province = _location.addressComponent.province; // 省份
                d.city = _location.addressComponent.city; // 城市
                d.district = _location.addressComponent.district; // 区县
                d.street = _location.addressComponent.street; // 街道
                d.description = _location.sematic_description; // 描述
                d.originData = _location;
                resolve(d);
            },
            fail(err) {
                reject(err);
            },
            complete() {}
        })
    })
}
/***
 * @function 地址反查-QQ
 * @param {Number} longitude 经度
 * @param {Number} latitude 纬度
 * @returns {Object} 返回地址信息
 */
Address.prototype.decodeAddressByQQ = function decodeAddressByQQ(longitude, latitude) {
    return new Promise((resolve, reject) => {
        if (!this.ak) {
            throw new Error('ak为空')
        };
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            method: 'GET',
            data: {
                key: this.ak,
                location: latitude + ',' + longitude,
                get_poi: 0,
                output: 'json'
            },
            success(data) {
                let _location = data.data.result;
                let d = {};
                d.longitude = _location.location.lng; // 经度
                d.latitude = _location.location.lat; // 纬度
                d.address = _location.address; // 合并地址
                d.cityCode = _location.ad_info.city_code; // 城市code
                d.adCode = _location.ad_info.adcode;
                d.country = _location.address_component.nation; // 国家
                d.province = _location.address_component.province; // 省份
                d.city = _location.address_component.city; // 城市
                d.district = _location.address_component.district; // 区县
                d.street = _location.address_component.street; // 街道
                d.description = _location.formatted_addresses.recommend; // 描述
                d.originData = _location;
                resolve(d);
            },
            fail(err) {
                reject(err);
            },
            complete() {}
        })
    })
}


/***
 * @function 同步获取地址-从缓存中获取
 * @returns {Object} 返回地址信息
 */
Address.prototype.getAddress = function getAddress() {
    let address = wx.getStorageSync('locationCache_tmp');
    if (address) {
        try {
            address = JSON.parse(address);
        } catch (error) {
            wx.clearStorageSync('locationCache_tmp');
            address = {};
            throw new Error('地址解析失败');
        }
    }
    return address;
};

/***
 * @function 清除缓存的地址
 */
Address.prototype.clear = function clear() {
    wx.removeStorageSync('locationCache_tmp');
};

export default new Address();