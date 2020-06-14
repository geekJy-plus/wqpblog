const headConf = require('./config/headConf.js');
const pluginsConf = require('./config/pluginsConf.js');
const navConf = require('./config/navConf.js');
const sidebarConf = require('./config/sidebarConf.js');


module.exports = {
    base: "/wqpblog/",
    title: "王钦鹏的个人博客",
    description: "欢迎来到王钦鹏的个人博客",
    head: headConf,
    plugins: pluginsConf,
    themeConfig: {
        lastUpdated: '更新时间', // string | boolean
        logo: '/assets/img/hero.png',
        nav: navConf,
        sidebar: sidebarConf
    }
}