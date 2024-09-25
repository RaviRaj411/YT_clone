let getUrlParams = () => {
    let urlParams = new URLSearchParams(window.location.search)
    let params = {
        videoId: urlParams.get('q'),
        categoryId: parseInt(urlParams.get('c'))
    }
    console.log(params.videoId);
    console.log(params.categoryId);
    return params
}

let video_data = async () => {
    let vid = document.querySelector('#vbox')
    let params = getUrlParams()

    vid.innerHTML = `
               <iframe src="https://www.youtube.com/embed/${params.videoId}?autoplay=1"
                title="Embed videos and playlists" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
            
        `;

}
video_data()


let sidebarIco = document.getElementById('sidebarIco')
let button = document.getElementsByClassName('button')
let btn = document.getElementsByClassName('sidebutton')
let sidebar = document.getElementById('sidebar')
// sidebutton.classList.toggle('sidebutton')
sidebarIco.addEventListener('click', () => {
    sidebar.classList.toggle('hide')

})

window.addEventListener("beforeunload", function (event) {
    if (event.persisted) {
        const input = document.getElementById('searchInp');
        const value = input.value;
        //   input.value = ''; 
        window.location.reload()
        //   input.value = value;
    }
});

//! api integration


let apikey = 'AIzaSyDuVY85OBBizeRvSU6eO5_wp0-aCMZKqxI'
apikey = 'AIzaSyBhP5KpojLg033kMcSIuFBgwpZCyyO0cuI'

let search_http = 'https://www.googleapis.com/youtube/v3/search?'
let video_http = 'https://www.googleapis.com/youtube/v3/videos?'
let channel_http = 'https://www.googleapis.com/youtube/v3/channels?'


let videoinfo_disp = async () => {
    let mainContent = document.getElementById('mainContent')
    let params = getUrlParams()
    let vdparam = new URLSearchParams({

        key: apikey,
        part: 'snippet',
        id: params.videoId
    })
    let singleVidData = await fetch(video_http + vdparam)
    singleVidData = await singleVidData.json()
    console.log(singleVidData);

    let chparam = new URLSearchParams({

        key: apikey,
        part: 'snippet',
        id: singleVidData.items[0].snippet.channelId
    })
    let channelData = await fetch(channel_http + chparam)
    channelData = await channelData.json()
    singleVidData.channelImg = channelData.items[0].snippet.thumbnails.high.url
    console.log(singleVidData);

    let vidinfo = document.createElement('div')
    mainContent.append(vidinfo)
    vidinfo.setAttribute('class', 'vidinfo');
    vidinfo.innerHTML=`
                <div class="title">
                    <h2>${singleVidData.items[0].snippet.title}</h2>
                </div>
                <div class="channelinfo">
                    <div class="clogo"><img src="${singleVidData.channelImg}" alt=""></div>
                    <div class="cname">
                        <h3>${singleVidData.items[0].snippet.channelTitle}</h3>
                        <p> </p>
                    </div>
                    <div class="sub">
                        <button class="Subscribe"><i class="fa-solid fa-bell"></i> Subscribed <i
                                class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="likeDislike">
                        <button><i class="fa-regular fa-thumbs-up"></i></button>|<button><i class="fa-regular fa-thumbs-down"></i></button>
                    </div>
                    <button><i class="fa-solid fa-share"></i> Share</button>
                    <button><i class="fa-solid fa-download"></i> Download</button>
                    <button><i class="fa-solid fa-ellipsis"></i></button>

                </div>`
   


}
videoinfo_disp()

let callYoutubeVideo = async () => {
    // console.log(query);
    let params = getUrlParams()
    let videoparam = new URLSearchParams({

        key: apikey,
        part: 'snippet',
        // q: query,
        maxResults: 20,
        chart: "mostPopular",
        regionCode: 'IN',
        videoCategoryId: params.categoryId

    })
    let res = await fetch(video_http + videoparam)
    let data = await res.json();
    // console.log(data);
    let videoData = data.items
    // console.log(videoData);
    let mainContent = document.getElementById('videolist')

    videoData.map(async element => {
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
        let card = document.createElement('a')
        mainContent.append(card)
        card.setAttribute('href', `play.html?q=${element.id}&c=${element.snippet.categoryId}`);
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
                </div>
                <div class="options"><i class="fa-solid fa-ellipsis-vertical"></i></div>
            </div>

                `


    });
    // console.log(videoData);

}

callYoutubeVideo()


let searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', () => {
    let searchInp = document.getElementById('searchInp').value
    // callYoutubeSearch(searchInp)
    mainContent.innerHTML = ''
    window.location.href = `../html/search.html?q=${searchInp}`
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
