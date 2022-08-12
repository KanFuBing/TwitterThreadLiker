const mountThreadLiker = () => {
    // The author of the opened tweet
    const tweeterName = window.location.pathname.split('/')[1]

    // filter tweets sended by other users
    const allTweeterTweetsNodes = Array.from(document.querySelectorAll('[data-testid="tweet"]')) // texts of tweets
        .filter(parentNode => parentNode.querySelector('a[tabindex="-1"]').getAttribute('href').endsWith(tweeterName))

    // find like buttons in tweeter's tweets
    const allLikeTweeterTweetsButtons = Array.from(allTweeterTweetsNodes)
        .map(tweetNode => tweetNode.querySelector('[aria-label*="Like"][role="button"]'))
        .map(likeButtonContainer => likeButtonContainer?.children[0].children[0])

    const likeAllTweeterTweets = () => {
        // like the whole thread
        allLikeTweeterTweetsButtons.forEach(likeButton => {
            likeButton.click()
        })
    }

    // hold 0.8s -> like all, click -> like one
    const handleLike = event => {
        const likeAllTimer = setTimeout(likeAllTweeterTweets, 800)
        event.target.addEventListener('mouseup', () => {
            clearTimeout(likeAllTimer)
        })
    }

    allLikeTweeterTweetsButtons.forEach(likeButton => {
        // keep special buttons alway pink
        likeButton.querySelector('svg').style.color = 'rgb(249,24,128)'
        likeButton.querySelector('svg').style.transition = '0.2s ease-in'
        likeButton.addEventListener('click', () => {
            setTimeout(() => {
                likeButton.querySelector('svg').style.color = 'rgb(249,24,128)'
            }, 100)
        })

        if (likeButton.getAttribute('name') != 'ListenerAdded') {
            likeButton.addEventListener('mousedown', handleLike)

            // Twitter only renders tweets in the viewport
            // So listener may be added multiple times, checking is necessary
            likeButton.setAttribute('name', 'ListenerAdded')
        }
    })
}

const ThreadLikerTrigger = () => {
    const loadTimer = setInterval(() => {
        // load the extension when the current thread loaded
        if (document.querySelectorAll('[data-testid="tweet"]').length > 0) {
            clearInterval(loadTimer)
            mountThreadLiker()
        }
    }, 256)
}

let url, tweetsCount
// listen to url change or more tweets load
setInterval(() => {
    if (window.location.href !== url || document.querySelectorAll('[data-testid="tweet"]').length !== tweetsCount) {
        url = window.location.href
        tweetsCount = document.querySelectorAll('[data-testid="tweet"]').length
        ThreadLikerTrigger()
    }
}, 256);
