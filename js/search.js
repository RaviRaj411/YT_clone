let sidebarIco = document.getElementById('sidebarIco')
let button = document.getElementsByClassName('button')
let btn = document.getElementsByClassName('sidebutton')
let sidebar = document.getElementById('sidebar')
// sidebutton.classList.toggle('sidebutton')
sidebarIco.addEventListener('click', () => {
    console.log('clicked');
    console.log();
    for (let val of button) {
        val.classList.toggle('hide')

    }
    for (let val of btn) {
        val.classList.toggle('smallbtn')

    }

})

//! api integration

let apikey = 'Put your own key'

let search_http = 'https://www.googleapis.com/youtube/v3/search?'
let video_http = 'https://www.googleapis.com/youtube/v3/videos?'
let channel_http = 'https://www.googleapis.com/youtube/v3/channels?'
// let single_video_http = 'https://www.googleapis.com/youtube/v3/videos?'
let urlParams = new URLSearchParams(window.location.search)
let searchInp = urlParams.get('q')
console.log(searchInp);

let callYoutubeSearch = async query => {
    console.log(query);
    let searchparam = new URLSearchParams({

        key: apikey,
        part: 'snippet',
        q: query,
        maxResults: 50,
        regionCode: 'IN',
        type: 'video'
    })
    let res = await fetch(search_http + searchparam)
    let data = await res.json();
    // console.log(data);
    let searchData = data.items
    searchData.map(async element => {
        let chparam = new URLSearchParams({

            key: apikey,
            part: 'snippet',
            id: element.snippet.channelId
        })
        let channelData = await fetch(channel_http + chparam)
        channelData = await channelData.json()
        // console.log(channelData);
        element.channelImg = channelData.items[0].snippet.thumbnails.high.url
        // console.log(element);
        

        let vdparam = new URLSearchParams({

            key: apikey,
            part: 'snippet',
            id: element.id.videoId
        })
        let singleVidData = await fetch(video_http + vdparam)
        singleVidData = await singleVidData.json()
        // console.log(channelData);
        element.categoryId = singleVidData.items[0].snippet.categoryId
        console.log(element.categoryId,singleVidData);
        let card = document.createElement('a')
        mainContent.append(card)
        // console.log(element.id.videoId);
        card.setAttribute('href', `play.html?q=${element.id.videoId}&c=${element.categoryId}`)
        // console.log(element);
        card.setAttribute('class', 'card')
        card.innerHTML = `
          <div class="tn"><img src="${element.snippet.thumbnails.high.url}" alt="Thumbnail"></div>
            <div class="cbottum">
                <div class="clogo"><img src="${element.channelImg}" alt="clogo"></div>
                <div class="cright">
                    <div class="title">
                        <h3>${element.snippet.title}</h3>
                    </div>
                    <div class="channelName">
                        <p>${element.snippet.channelTitle}</p>
                    </div>
                    <div class="views">
                        <p>${timeAgo(element.snippet.publishedAt)}</p>
                    </div>
                    <br>
                    <div class='dic'>
                        <p>
                        ${element.snippet.description}
                        </p>
                    </div>
                </div>
                <div class="options"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            </div>

                `


    })
}
callYoutubeSearch(searchInp)

let searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', () => {
    let searchInp = document.getElementById('searchInp').value
    callYoutubeSearch(searchInp)
    mainContent.innerHTML = ''
})
function timeAgo(dateString) {
    const currentTime = new Date();
    const pastTime = new Date(dateString);
    const diffInMs = currentTime - pastTime; // Time difference in milliseconds

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximation
    const years = Math.floor(days / 365); // Approximation

    if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return seconds <= 1 ? 'just now' : `${seconds} seconds ago`;
    }
}
