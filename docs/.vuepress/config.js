module.exports = {
    title: "王钦鹏的个人博客",
    description: "欢迎来到王钦鹏的个人博客",
    head: [
        ['link', { rel: 'icon', href: 'assets/img/favicon.ico' }],
        ['meta', { name: 'author', content: '王钦鹏' }],
        ['meta', { name: 'keywords', content: 'vuepress ,王钦鹏,wangqinpeng,博客,blog' }]
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