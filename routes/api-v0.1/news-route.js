/**
 * Created by david on 16-06-15.
 */

var route = require('./routes');
var NewsModel = require('../../models/news-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var NewsRoute = (function () {

    function NewsRoute() {
        this.getNew = __bind(this.getNew, this);
        this.getNews = __bind(this.getNews, this);
        this.saveNews = __bind(this.saveNews, this);
        this.deleteNew = __bind(this.deleteNew, this);
        this.updateNew = __bind(this.updateNew, this);
    }

    NewsRoute.prototype.getNew = function(response, request){

    };
    NewsRoute.prototype.getNews = function(response, request){

    };
    NewsRoute.prototype.saveNews = function(response, request){

    };
    NewsRoute.prototype.deleteNew = function(response, request){

    };
    NewsRoute.prototype.updateNew = function(response, request){

    };
    return NewsRoute;
});

exports = function(app){
    var newsRoute;
    newsRoute = new NewsRoute();
    app.get(route.NewRoute, newsRoute.getNew);
    app.get(route.NewsRoute, newsRoute.getNews);
    app.put(route.NewRoute, newsRoute.updateNew);
    app.post(route.NewRoute, newsRoute.saveNews);
    app.delete(route.NewRoute, newsRoute.deleteNew);
};