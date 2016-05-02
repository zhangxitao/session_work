/**
 * Created by xitao on 2016/5/2.
 */


var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var uuid = require('uuid');
var clone = require('clone');
var fs = require('fs');
var MyFileStore = require('./MyFileStore')(session);

var app = express();
var sessionPath="/home/xitao/webssproject/session_work";
app.use(session({
    store: new MyFileStore({path:sessionPath}),
    secret: 'keyboard cat',
    saveUninitialized:true,
    resave:true
}));



app.use(function(req,res,next){
    var views = req.session.views;
    if(!views){
        views = req.session.views={}
    }
    var pathname = parseurl(req).pathname;
    views[pathname] = (views[pathname] || 0) + 1
    next();
});

app.get('/foo',function(req,res,next){
    res.send('you viewed this page '+req.session.views['/foo']+' times')
});

app.get('/bar',function(req,res,next){
    res.send('you viewed this page '+req.session.views['/bar']+' times')
});


app.listen(3000);
console.log('Web server has started on http://127.0.0.1:3000')

