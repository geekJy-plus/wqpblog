module.exports = [
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
]