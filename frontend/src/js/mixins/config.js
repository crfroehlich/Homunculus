
let config = {
    pathImg: (folder) => {
        let ret = `${window.FrontEnd.config.site.imageUrl}`;
        if (folder) {
            ret += `${folder}/`;
        }
        return ret;
    },
    getData: (path, callback, that) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            that.data = data;
            that.update();
            if (callback) {
                callback(data);
            }
        });
    },
    watchData: (path, callback) => {
        window.FrontEnd.MetaFire.on(`${window.FrontEnd.site}/${path}`, (data) => {
            if (callback) {
                callback(data);
            }
        });
    }
};

module.exports = config;