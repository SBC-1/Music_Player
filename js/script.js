const musicWrap=document.querySelector('.wrapper');
const bodyWrap=musicWrap.querySelector('.img_info_wrap');
const musicAudio=musicWrap.querySelector('#main-audio');
const imgWrap=musicWrap.querySelector('.m-img');
const albumArt=musicWrap.querySelector('.m-img>img');
const musicName=musicWrap.querySelector('.name');
const musicArtist=musicWrap.querySelector('.artist');
const musicLyrics=musicWrap.querySelector('.m-lyrics');
const toggleBtn=musicWrap.querySelector('#toggle-btn');
const playBtn=musicWrap.querySelector('#play-btn');
const prevBtn=musicWrap.querySelector('#prev-btn');
const nextBtn=musicWrap.querySelector('#next-btn');
const repeatBtn=musicWrap.querySelector('#repeat-btn');
const shuffleBtn=musicWrap.querySelector('#shuffle-btn');
const progress=musicWrap.querySelector('.m-progress');
const progressBar=progress.querySelector('.bar');
const progressPin=progress.querySelector('.bar>.pin');
const playTime=progress.querySelector('.current');
const totTime=progress.querySelector('.duration');
const listBtn=musicWrap.querySelector('#list-btn');
const playList=musicWrap.querySelector('#play-list');
const playListUl = musicWrap.querySelector('#play-list>ul');
const favoriteBtn=musicWrap.querySelector('#favorite-btn');
const volumeBtn=musicWrap.querySelector('#volume-btn');
const volumeCtrl=musicWrap.querySelector('#volume-ctrl');
const volumeRange=musicWrap.querySelector('.volumerange');
let list_index=0;
musicAudio.volume=0.5;


const loadMusic=(num)=>{
	albumArt.src=`images/${musicList[num].img}.jpg`;
	musicAudio.src=`songs/${musicList[num].audio}.mp3`;
	musicName.innerHTML=musicList[num].name;
	musicArtist.innerHTML=musicList[num].artist;
	musicLyrics.innerHTML=musicList[num].lyrics;
	musicLyrics.scrollTop=0;
	imgWrap.style.transform='scale(1)';
}


const playMusic=()=>{
	playBtn.innerHTML="pause";
	let playPromise=musicAudio.play();
	if (playPromise !== undefined) { playPromise.then((_) => {}).catch((error) => {}); }
}

const pauseMusic=()=>{
	playBtn.innerHTML="play_arrow";
	musicAudio.pause();
}

playBtn.addEventListener('click',(e)=>{
	let getText=playBtn.innerText;
	(getText=="pause")? pauseMusic() : playMusic();
	if(e.target.innerHTML=='pause'){
		imgWrap.style.transform='scale(1)';
	} else{
		imgWrap.style.transform='scale(0.8)';
	}
});


const prevMusic=()=>{
	list_index--;
	if(list_index<0){ list_index=musicList.length-1; }
	loadMusic(list_index);
	playMusic();
	playListMusic();
}

const nextMusic=()=>{
	list_index++;
	list_index=list_index%musicList.length;
	loadMusic(list_index);
	playMusic();
	playListMusic();
}
nextBtn.addEventListener('click',()=>{ nextMusic(); });
prevBtn.addEventListener('click',()=>{ prevMusic(); });


musicAudio.addEventListener('timeupdate',(e)=>{
	let curr=e.target.currentTime;
	let duration=e.target.duration;
	let progressRatio=(curr/duration)*100;
	progressBar.style.width=`${progressRatio}%`;
	progressPin.style.left=`${96.5}%`;

	let currMin=Math.floor(curr/60);
	let currSec=Math.floor(curr%60);
	if(currSec<10) currSec=`0${currSec}`;
	playTime.innerHTML=`${currMin}:${currSec}`;
	musicAudio.addEventListener('loadeddata',()=>{

		let totDuration=musicAudio.duration;
		let totMin=Math.floor(totDuration/60);
		let totSec=Math.floor(totDuration%60);
		if(totSec<10) totSec=`0${totSec}`;
		totTime.innerHTML=`${totMin}:${totSec}`;
	});
});


progress.addEventListener('click',(e)=>{
	let maxWidth=progress.clientWidth;
	let clickXpos=e.offsetX;
	let totDuration=musicAudio.duration;
	musicAudio.currentTime=(clickXpos/maxWidth)*totDuration;
	playMusic();
	progressPin.style.left=`${96.5}%`;
});

toggleBtn.addEventListener('click',()=>{
	musicLyrics.classList.remove('active');
	listBtn.classList.remove('active');
});


bodyWrap.addEventListener('click',()=>{
	musicLyrics.classList.toggle('active');
});

const repeat=()=>{
    repeatBtn.innerHTML="repeat_one";
    repeatBtn.setAttribute('title','한곡 반복');
}
const repeat_one=()=>{
    repeatBtn.innerText='repeat';
    repeatBtn.setAttribute('title','전체 반복');
}
repeatBtn.addEventListener('click',()=>{
    if(repeatBtn.innerHTML=='repeat'){
        repeat();
    }else{
        repeat_one();
    }
})

const shuffle=()=>{
    shuffleBtn.innerHTML="shuffle_on"
    shuffleBtn.setAttribute('title','랜덤 반복');
}
const shuffle_on=()=>{
    shuffleBtn.innerText='shuffle';
	shuffleBtn.setAttribute('title','순서대로 반복');
}
shuffleBtn.addEventListener('click',()=>{
    if(shuffleBtn.innerHTML=='shuffle'){
        shuffle();
    }else{
        shuffle_on();
    }
})
musicAudio.addEventListener('ended',()=>{
    if(repeatBtn.innerHTML=='repeat'){
        nextMusic();
    }else{
        loadMusic(list_index);
        playMusic();
    };
    if(shuffleBtn.innerHTML=='shuffle'){
        loadMusic(list_index);
        playMusic();
    }else if(repeatBtn.innerHTML=='repeat'){
        let randomIndex=Math.floor(Math.random()*musicList.length);
				do{
					randomIndex=Math.floor(Math.random()*musicList.length);
				} while(list_index==randomIndex);
				list_index=randomIndex;
				loadMusic(list_index);
				playMusic();
    }
    playListMusic();
})

listBtn.addEventListener('click',function(){
	this.classList.toggle('active');
});
for (let i=0; i<musicList.length; i++) {
	let li=`
			<li data-index="${i}">
					<strong>${musicList[i].name}</strong>
					<em>${musicList[i].artist}</em>
					<audio class="${musicList[i].audio}" src="songs/${musicList[i].audio}.mp3"></audio>
					<span class="audio-duration" id="${musicList[i].audio}">재생시간</span>
			</li>
	`;
	playListUl.insertAdjacentHTML('beforeend', li);

	let liAudioDuration = playListUl.querySelector(`#${musicList[i].audio}`);
	let liAudio = playListUl.querySelector(`.${musicList[i].audio}`);
	liAudio.addEventListener('loadeddata',()=>{
			let totDuration = liAudio.duration;
			let totMin = Math.floor(totDuration/60);
			let totSec = Math.floor(totDuration%60);
			if(totSec<10) totSec=`0${totSec}`;
			liAudioDuration.innerHTML=`${totMin}:${totSec}`;
			liAudioDuration.setAttribute('data-duration',`${totMin}:${totSec}`);
	});
}


const playListMusic=()=>{
	const playListAll=playListUl.querySelectorAll('li');
	for(let i=0; i<playListAll.length; i++){
		let audioTag=playListAll[i].querySelector('.audio-duration');

		if(playListAll[i].classList.contains('active')){
			playListAll[i].classList.remove('active');
			let audioDur=audioTag.getAttribute('data-duration');
			audioTag.innerHTML=audioDur;
		}
		if(playListAll[i].getAttribute('data-index')==list_index){
			playListAll[i].classList.add('active');
			audioTag.innerHTML='Playing';
		}

		playListAll[i].setAttribute('onclick','clicked(this)');
	}
}
const clicked=(elem)=>{
	let getliIndex = elem.getAttribute('data-index');
	list_index = getliIndex;
	loadMusic(list_index);
	playMusic();
	playListMusic();
}


favoriteBtn.addEventListener('click',(e)=>{
	e.target.classList.toggle('active');
});


volumeBtn.addEventListener('click',(e)=>{
	e.target.classList.toggle('open');
	volumeCtrl.classList.toggle('hidden');
});
volumeRange.addEventListener('change',()=>{
	let oriVol=musicAudio.volume;
	musicAudio.volume=volumeRange.value/100;
	let currVol=musicAudio.volume;
	if(currVol==0){
		volumeBtn.innerHTML='volume_off';
	} else if(oriVol<=currVol){
		volumeBtn.innerHTML='volume_up';
	} else{
		volumeBtn.innerHTML='volume_down';
	}
});


window.addEventListener('load',()=>{
	loadMusic(list_index);
	playListMusic();
});