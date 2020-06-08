module.exports = [
    { text: '首页', link: '/' },
    { text: '关于我', link: '/about/' },
    { text: 'Vue.js', link: '/vue/' },

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
]