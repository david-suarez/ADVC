advcApp.service('fileUploadSrv', ['$http', function ($http) {
    this.commonResourceUrl = 'http://' + document.domain + ':3000/api/v0.1/';

    this.uploadFileToUrl = function(file, model, callback){
        this.resourceForUpload = this.commonResourceUrl + model + '/fileupload';
        var fd = new FormData();
        fd.append('file', file);
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function(evt) {
            var error, object;
            if(evt) {
                try {
                    object = JSON.parse(evt.target.response);
                    return typeof callback === "function" ?
                        callback(object, evt.target.response) : void 0;
                }
                catch(error) {
                    return typeof callback === "function" ?
                        callback(null, evt.target.response) : void 0;
                }
            }
        }, false);

        xhr.addEventListener('error', function(evt){
            if(evt){
                return typeof callback === "function" ?
                    callback(null, evt.target.response) : void 0;
            }
        }, false);

        xhr.open('POST', this.resourceForUpload);
        return xhr.send(fd);
    }
}]);