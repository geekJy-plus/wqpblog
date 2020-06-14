module.exports = [
    { text: '首页', link: '/' },
    { text: '关于我', link: '/about/' },
    { text: 'Vue.js', link: '/vue/' },
    { text: '基础', link: '/basic/' },

    {
        text: '面试',
        ariaLabel: 'Interview Menu',
        items: [
            { text: '基础', link: 'docs/vue/day1.md/' },
            { text: '进阶', link: '/language/japanese/' }
        ]
    },
    {
        text: 'study',
        items: [{
                text: '',
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

    { text: 'Github', link: 'https://github.com/geekJy-plus' },
]