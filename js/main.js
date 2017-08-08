"use strict";
function s() {
    var colors = [
        '0,150,136',
        '128,203,196',
        '0,188,212',
        '0,172,193',
        '0,188,212'
    ];
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    var width = c.width = window.innerWidth;
    var height = c.height = window.innerHeight;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0, len = 5; i < len; i++) {
        var a = 0.5;
        var radius = 1;
        var y = Math.random() * height / 2;
        var x = width * (2 * Math.random() + 1) / 4;
        ctx.fillStyle = 'rgba(' + colors[parseInt(Math.random() * len)] + ',' + a + ')';
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
s();