/**
 * Created by xitao on 2016/5/2.
 */




fs = require('fs');
path=require('path')

module.exports = function (session) {
    var Store = session.Store;
    function MyFileStore(options) {
        var self = this;
        options = options || {};
        Store.call(self, defaultOption(options));

        self.options = defaultOption(options);

        /**fs.mkdirSync(self.options.path, function (err) {
            if (err) {
                throw err;
            }
            console.log("directory created or already exist")
        });*/
    }

    /**
     * Inherit from Store
     */
    MyFileStore.prototype.__proto__ = Store.prototype;

    MyFileStore.prototype.get = function (sessionId,callBack) {
        var sessionPath = this.options.path+sessionId+'.json';
        fs.readFile(sessionPath, 'utf8', function (err, data) {
            if (!err) {
                var json;
                try {
                    json = JSON.parse(data);
                } catch (err2) {
                    err = err2;
                }
                return callBack(null, json);
            }

        });

    };

    MyFileStore.prototype.set = function (sessionId, session, callback) {
        try {
            var sessionPath = this.options.path + sessionId + '.json';
            var json = JSON.stringify(session);
            fs.writeFile(sessionPath, json, function (err) {
                if(err) console.log("complete");
                if (callback) {
                    err ? callback(err) : callback(null, session);
                }
            });
        }catch (err) {
            if (callback) callback(err);
        }

    };
    MyFileStore.prototype.destroy = function (sessionId, callback) {
        var sessionPath = this.options.path+sessionId+'.json';
        console.log('deleting sessionPath:'+sessionPath)
        fs.remove(sessionPath);
    };


    return MyFileStore;
};
function defaultOption(options) {
    options = options || {};

    var NOOP_FN = function () {
    };
    return {
        path: path.normalize(options.path || './sessions'),
        ttl: options.ttl || 3600,
        retries: options.retries || 5,
        factor: options.factor || 1,
        minTimeout: options.minTimeout || 50,
        maxTimeout: options.maxTimeout || 100,
        filePattern: /\.json$/,
        reapInterval: options.reapInterval || 3600,
        reapMaxConcurrent: options.reapMaxConcurrent || 10,
        reapAsync: options.reapAsync || false,
        reapSyncFallback: options.reapSyncFallback || false,
        logFn: options.logFn || console.log || NOOP_FN,
        fallbackSessionFn: options.fallbackSessionFn,
        encrypt: options.encrypt || false
    };
}
