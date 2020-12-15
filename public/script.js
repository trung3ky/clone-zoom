const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myPeer = new Peer(undefined, {
    // path: '/peerjs',
    host: '/',
    port: '3001'
})

const myvideo = document.createElement('video');
//bật âm thanh cho video
myvideo.muted = true;

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(stream => { //stream là kết quả trả về nó là giao diện đại diện cho 1 dòng nội dung phương tiện truyền thông.
    myVideoStream = stream;
    addVideoStream(myvideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})


myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove();
    })
}

//hiển thị video trên màn hình
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

//mute or video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `;
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `;
    document.querySelector('.main_mute_button').innerHTML = html;
}

//video
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `;
    document.querySelector('.main_video_button').innerHTML = html;
    // var x = document.getElementsByTagName("VIDEO");
    // x[0].style.border = "solid 1px black";
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `;
    document.querySelector('.main_video_button').innerHTML = html;
    // var x = document.getElementsByTagName("VIDEO");
    // x[0].style.border = "solid 1px gray";
}