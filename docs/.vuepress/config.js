const moment = require('moment');
moment.locale("zh-cn");

module.exports = {
    base: "/wqpblog/",
    title: "王钦鹏的个人博客",
    description: "欢迎来到王钦鹏的个人博客",
    head: [
        ['link', { rel: 'icon', href: 'assets/img/favicon.ico' }],
        ['meta', { name: 'author', content: '王钦鹏' }],
        ['meta', { name: 'keywords', content: 'vuepress ,王钦鹏,wangqinpeng,博客,blog' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
        ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
        ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    plugins: [
        [
            '@vuepress/last-updated',
            {
                transformer: (timestamp, lang) => {

                    return moment(timestamp).format("LLLL")
                }
            }
        ],
        ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: {
                message: "发现新内容",
                buttonText: "刷新"
            }
        }]
    ],
    themeConfig: {
        lastUpdated: '更新时间', // string | boolean
        logo: '/assets/img/hljdx.png',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about/' },
            { text: 'Foo', link: '/foo/' },

            {
                text: 'Languages',
                ariaLabel: 'Language Menu',
                items: [
                    { text: 'Chinese', link: '/language/chinese/' },
                    { text: 'Japanese', link: '/language/japanese/' }
                ]
            },
            {
                text: 'study',
                items: [{
                        text: 'Group1',
                        items: [
                            { text: 'Chinese', link: '/language/chinese/' },
                            { text: 'Japanese', link: '/language/japanese/' }
                        ]
                    },
                    {
                        text: 'Group2',
                        items: [{ text: 'Chinese', link: '/language/chinese/' },
                            { text: 'Japanese', link: '/language/japanese/' }
                        ]
                    }
                ]
            },

            { text: 'External', link: 'https://google.com' },
        ],
        sidebar: {
            '/foo/': [
                '', /* /foo/ */
                'one', /* /foo/one.html */
                'two' /* /foo/two.html */
            ],
            '/bar/': [
                '', /* /bar/ */
                'three', /* /bar/three.html */
                'four' /* /bar/four.html */
            ],


        }
    }
}