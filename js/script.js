const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	IOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.IOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');
	let menuElements = document.querySelectorAll('.menu__element')
	if (menuElements.length > 0) {
		for (let index = 0; index < menuElements.length; index++) {
			const menuElement = menuElements[index];
			menuElement.addEventListener('click', (event) => {
				event.preventDefault();
			});
			menuElement.addEventListener('click', function () {
				menuElement.classList.toggle('_active');
			});
		}
	}
	const menuIcon = document.querySelector('.menu__icon');
	const menuList = document.querySelector('.menu__list');
	menuIcon.addEventListener('click', (event) => {
		event.preventDefault();
	});
	menuIcon.addEventListener('click', function () {
		menuIcon.classList.toggle('menu__icon_active');
		menuList.classList.toggle('menu__list_active');
	});
} else {
	document.body.classList.add('_pc');
}

const movieContainers = document.querySelectorAll('.movie__container');
const trailerContainers = document.querySelectorAll('.trailer__container');
const movieTitles = document.querySelectorAll('h2');
const movieRatings = document.querySelectorAll('.rating');
const movieDescriptions = document.querySelectorAll('.description');
const movieGenres = document.querySelectorAll('.genre');
const movieSlides = document.querySelectorAll('.swiper-slide');
const hitsShows = document.querySelector('.hits-and-shows');


function onYouTubeIframeAPIReady(videoId, playerId, container) {
	if (container && container.id && videoId) {
		let player = new YT.Player(container.id, {
			height: '100%',
			width: '100%',
			videoId: videoId,
		});
	}

}

async function getVideo(movieId, videoContainer) {
	try {
		const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US`);
		const { results } = await response.json();
		const videoId = results[0]?.key || null;
		const playerId = `player_${videoId}`;
		const video = document.createElement('div');
		video.classList.add('video');
		video.id = playerId;
		videoContainer.appendChild(video);
		onYouTubeIframeAPIReady(videoId, playerId, video);
	} catch (error) {
		console.error(error);
	}
}

async function getMovies() {
	const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US&page=1");
	const { results } = await response.json();
	for (let i = 0; i < 4; i++) {
		const movieId = results[i].id;
		movieTitles[i].innerText = results[i].title;
		movieRatings[i].innerHTML = `<span>Rating:</span> ${results[i].vote_average}`;
		movieDescriptions[i].innerHTML = `<span>Description:</span> ${results[i].overview}`;

		const baseUrl = 'https://image.tmdb.org/t/p/';
		const posterPath = results[i].poster_path;
		const posterSize = 'w500';
		const posterUrl = baseUrl + posterSize + posterPath;
		movieSlides[i].style.background = `url(${posterUrl}) no-repeat center left/ cover`;
		movieSlides[i].style.backdropFilter = 'blur(50px)';
		const playButton = document.createElement('button');
		playButton.innerText = 'play now';
		playButton.classList.add('playButton');
		movieContainers[i].appendChild(playButton);
		getVideo(movieId, trailerContainers[i]);
	}
}

const hitsSwiper = document.querySelector('.hits-slider');
const hitsWrapper = document.querySelector('.hits-slider__wrapper');

async function getHits() {
	const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US&page=1");
	const { results } = await response.json();
	for (let i = 0; i < 11; i++) {
		const movieId = results[i].id;

		const hitsSlide = document.createElement('div');
		hitsSlide.classList.add('hits-slider__slide', 'swiper-slide');
		const hitTrailer = document.createElement('div');
		hitTrailer.classList.add('hitTrailer');
		const hitContainer = document.createElement('div');
		hitContainer.classList.add('hits__container');
		const hitTitle = document.createElement('h4');
		const hit = document.createElement('div');
		hit.classList.add('hit');
		const duration = document.createElement('p');
		duration.classList.add('duration');
		const genre = document.createElement('p');
		genre.classList.add('genre');

		hitTitle.innerText = results[i].title;
		duration.innerText = results[i].release_date;
		genre.innerText = results[i].vote_average;

		hit.append(duration);
		hit.append(genre);
		hitContainer.append(hitTitle);
		hitContainer.append(hit);
		hitsSlide.append(hitTrailer);
		hitsSlide.append(hitContainer);
		hitsWrapper.append(hitsSlide);
		getVideo(movieId, hitTrailer);
	}
}
const latestSwiper = document.querySelector('.latest-slider');
const latestMiniSwiper = document.querySelector('.latest-mini-slider');
const latestWrapper = document.querySelector('.latest-slider__wrapper');
const latestMiniWrapper = document.querySelector('.latest-mini-slider__wrapper');
async function getLatest() {
	const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US&page=1");
	const { results } = await response.json();
	for (let i = 0; i < 4; i++) {
		// const movieId = results[i].id;
		const latestSlide = document.createElement('div');
		latestSlide.classList.add('latest-slider__slide', 'swiper-slide');
		const latestTitle = document.createElement('h2');
		const latestOverview = document.createElement('p');
		const latestButton = document.createElement('button');
		const baseUrl = 'https://image.tmdb.org/t/p/';
		const posterPath = results[i].poster_path;
		const posterSize = 'w500';
		const posterUrl = baseUrl + posterSize + posterPath;
		latestSlide.style.background = `url(${posterUrl}) no-repeat center left/ cover`;
		latestTitle.innerText = results[i].title;
		latestOverview.innerText = results[i].overview;
		latestButton.innerText = 'play now';
		latestSlide.append(latestTitle);
		latestSlide.append(latestOverview);
		latestSlide.append(latestButton);
		latestWrapper.appendChild(latestSlide);

		const latestMiniSlide = document.createElement('div');
		latestMiniSlide.classList.add('latest-mini-slider__slide', 'swiper-slide');
		const miniPosterSize = 'w300';
		const miniPosterUrl = baseUrl + miniPosterSize + posterPath;
		latestMiniSlide.style.background = `url(${miniPosterUrl}) no-repeat center left/ cover`;
		const latestMiniTitle = document.createElement('h5');
		const latestMiniInfo = document.createElement('div');
		const latestMiniDate = document.createElement('p');
		const latestMiniVote = document.createElement('p');
		latestMiniTitle.innerText = results[i].title;
		latestMiniDate.innerText = results[i].release_date;
		latestMiniVote.innerText = results[i].vote_average;
		latestMiniSlide.append(latestMiniTitle);
		latestMiniInfo.append(latestMiniDate);
		latestMiniInfo.append(latestMiniVote);
		latestMiniSlide.appendChild(latestMiniInfo);
		latestMiniWrapper.appendChild(latestMiniSlide);
	}
}
const topWrapper = document.querySelector('.top-slider__wrapper');
async function getTopRated() {
	const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US&page=1");
	const { results } = await response.json();
	for (let i = 0; i < 3; i++) {
		const topSlide = document.createElement('div');
		topSlide.classList.add('top-slider__slide', 'swiper-slide');

		const baseUrl = 'https://image.tmdb.org/t/p/';
		const posterPath = results[i].poster_path;
		const posterSize = 'w500';
		const posterUrl = baseUrl + posterSize + posterPath;
		topSlide.style.background = `url(${posterUrl}) no-repeat center left/ cover`;

		const topContainer = document.createElement('div');
		topContainer.classList.add('topContainer');

		const topTitle = document.createElement('h2');
		topTitle.classList.add('topTitle');
		topTitle.innerHTML = results[i].title;

		const topInfo = document.createElement('div');
		topInfo.classList.add('topInfo');

		const topDate = document.createElement('p');
		topDate.classList.add('infoEl');
		topDate.innerText = results[i].release_date;

		const topCircle = document.createElement('span');
		topCircle.classList.add('topCircle', 'infoEl');

		const topVote = document.createElement('p');
		topVote.classList.add('infoEl');
		topVote.innerText = results[i].vote_average;

		const topCircle2 = document.createElement('span');
		topCircle2.classList.add('topCircle', 'infoEl');

		const topLang = document.createElement('p');
		topLang.classList.add('infoEl');
		topLang.innerText = results[i].original_language;

		const topOverview = document.createElement('div');
		topOverview.classList.add('topOverview');
		topOverview.innerText = results[i].overview;

		topInfo.append(topDate);
		topInfo.append(topCircle);
		topInfo.append(topVote);
		topInfo.append(topCircle2);
		topInfo.append(topLang);
		topContainer.append(topTitle);
		topContainer.append(topInfo);
		topContainer.append(topOverview);
		topSlide.appendChild(topContainer);
		topWrapper.appendChild(topSlide);
	}
}


const movieSwiper = new Swiper('.movie-slider', {
	loop: false,
	// speed: 800,
	navigation: {
		prevEl: '.swiper-button-prev',
		nextEl: '.swiper-button-next',
	},

	// autoplay: {
	// 	delay: 3000,
	// 	stopOnLastSlide: false,
	// 	disableOnInteraction: false,
	// },
});

const hitSwiper = new Swiper('.hits-slider', {
	direction: 'horizontal',
	loop: false,
	// speed: 800,
	navigation: {
		prevEl: '.swiper-button-prev',
		nextEl: '.swiper-button-next',
	},
	slidesPerView: 4,
	spaceBetween: 30,
	// breakpoints: {
	// 	600: {
	// 		slidesPerView: 2,
	// 	},
	// },
	// autoplay: {
	// 	delay: 3000,
	// 	stopOnLastSlide: false,
	// 	disableOnInteraction: false,
	// },
});

const miniSwiper = new Swiper('.latest-mini-slider', {
	direction: 'horizontal',
	navigation: {
		prevEl: '.swiper-button-prev',
		nextEl: '.swiper-button-next',
	},
	allowSlideNext: true,
	allowSlidePrev: true,
	slidesPerView: 3,
	loop: true,
	spaceBetween: 30,
	centeredSlides: true,
	// simulateTouch: false,
});
const mySwiper3 = new Swiper('.latest-slider', {
	direction: 'horizontal',
	thumbs: {
		swiper: miniSwiper,
	},
	loop: false,
	simulateTouch: false,
	// speed: 800,
	// navigation: {
	// 	prevEl: '.swiper-button-prev',
	// 	nextEl: '.swiper-button-next',
	// },
	slidesPerView: 1,

	// thumbs: {
	// 	swiper: {
	// 		el: '.latest-mini-slider',
	// 		loop: true,
	// 		slidesPerView: 3,
	// 		spaceBetween: 30,
	// 		centeredSlides: true,
	// 		slidesPerGroup: 1,
	// 	},
	// },
});

const topSwiper = new Swiper('.top-slider', {
	direction: 'horizontal',
	loop: true,
	simulateTouch: false,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	slidesPerView: 1,
	autoplay: {
		delay: 3000,
		stopOnLastSlide: false,
		disableOnInteraction: false,
	},
	spaceBetween: 30,
});


// miniSwiper.controller.control = mySwiper3;
// mySwiper3.controller.control = miniSwiper;

movieSwiper.on('init', function () {
	movieSwiper.update();

	const prevButton = document.getElementsByClassName('swiper-button-prev')[0];
	const nextButton = document.getElementsByClassName('swiper-button-next')[0];

	prevButton.addEventListener('click', function () {
		movieSwiper.slidePrev();
	});

	nextButton.addEventListener('click', function () {
		movieSwiper.slideNext();
	});
});

movieSwiper.on('slideChange', function () {
	movieSwiper.update();
});

mySwiper3.on('init', function () {
	mySwiper3.update();
	const prevButton = document.getElementsByClassName('swiper-button-prev')[0];
	const nextButton = document.getElementsByClassName('swiper-button-next')[0];
	prevButton.addEventListener('click', () => {
		mySwiper3.slidePrev();
	});

	nextButton.addEventListener('click', () => {
		mySwiper3.slideNext();
	});

});




window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

document.addEventListener('DOMContentLoaded', () => {
	getMovies();
	getHits();
	// debugger;
	getLatest();
	getTopRated();

});

window.onload = function () {
	const tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};
