jQuery(document).ready(function ($) {
    $('body').click(function (e) {
        // const a = ['❤富强❤', '❤民主❤', '❤文明❤', '❤和谐❤', '❤自由❤', '❤平等❤', '公正', '法治', '爱国', '敬业', '诚信', '友善']
        const language = ['❤富强❤', '❤民主❤', '❤HTML❤', '❤文明❤', '❤和谐❤', '❤CSS❤', '❤和谐❤', '❤自由❤', '❤JavaScript❤', '❤平等❤', '❤公正❤', '❤Node❤', '❤法治❤', '❤爱国❤', '❤Vue❤', '❤敬业❤', '❤诚信❤', '❤友善❤']
        const x = e.pageX
        const y = e.pageY
        let Afont = Math.floor((Math.random() * (language.length)))
        const $i = $('<span/>').text(language[Afont])
        $i.css({
            'z-index': 9999,
            top: y - 20,
            left: x,
            position: 'absolute',
            'font-weight': 'bold',
            color: randomColor(),
            'font-size': '20px'
        })
        function randomColor() {
            return 'rgb(' + ~~(Math.floor(Math.random() * 256)) + ',' + ~~(Math.floor(Math.random() * 256)) + ',' + ~~(Math.floor(Math.random() * 256)) + ')'
        }
        $('body').append($i)
        $i.animate(
            {
                top: y - 180,
                opacity: 0
            },
            1500,
            function () {
                $i.remove()
            }
        )
    })
})
