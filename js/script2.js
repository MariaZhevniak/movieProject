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
	isSurfacePro: function () {
		return /Surface Pro 7/.test(navigator.userAgent);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.IOS() ||
			isMobile.Opera() ||
			isMobile.Windows() ||
			isMobile.isSurfacePro()
		);
	}
};
const menuIcon = document.querySelector('.menu__icon');
const menuList = document.querySelector('.menu__list');
const subList = document.querySelector('.sub-link__sub-list');
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
	menuIcon.addEventListener('click', (event) => {
		event.preventDefault();
	});
	menuIcon.addEventListener('click', function () {
		menuIcon.classList.toggle('menu__icon_active');
		menuList.classList.toggle('menu__list_active');
	});

	let subElements = document.querySelectorAll('.menu__sub-element');
	if (subElements.length > 0) {
		for (let index = 0; index < subElements.length; index++) {
			const subElement = subElements[index];
			subElement.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
			});
			subElement.addEventListener('click', function () {
				subElement.classList.toggle('_active');
				subList.classList.toggle('sub-link__sub-list_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
	menuIcon.addEventListener('click', (event) => {
		event.preventDefault();
	});
	menuIcon.addEventListener('click', function () {
		menuIcon.classList.toggle('menu__icon_active');
		menuList.classList.toggle('menu__list_active');
	});
}
console.log(navigator.userAgent);
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
const videosContainer = document.querySelector('.videos__container');
async function getMovies() {
	const response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=341db5b3bd453c84386208055c1cb3c7&language=en-US&page=1");
	const { results } = await response.json();
	for (let i = 0; i < 16; i++) {
		const movieId = results[i].id;
		const videoContainer = document.createElement('div');
		videoContainer.classList.add('videoContainer');
		const trailerContainer = document.createElement('div');
		trailerContainer.classList.add('trailerContainer');
		const movieText = document.createElement('div');
		movieText.classList.add('movieText');
		const movieTitle = document.createElement('h3');
		movieTitle.classList.add('movieTitle')
		const movieInfo = document.createElement('div');
		movieInfo.classList.add('movieInfo');
		const movieRating = document.createElement('p');
		movieRating.classList.add('movieRating');
		const movieCircle = document.createElement('span');
		movieCircle.classList.add('movieCircle');
		const movieDate = document.createElement('p');
		movieDate.classList.add('movieDate');

		const faIcons = document.createElement('div');
		faIcons.classList.add('faIcons');
		const faHeart = document.createElement('button');
		faHeart.classList.add('fa-regular', 'fa-heart', 'fa-lg', 'faIcon');
		const faShare = document.createElement('button');
		faShare.classList.add('fa-sharp', 'fa-solid', 'fa-share-nodes', 'fa-lg', 'faIcon');
		const shareMenu = document.createElement('div');
		shareMenu.classList.add('shareMenu');
		const shareArrow = document.createElement('div');
		shareArrow.classList.add('fa-sharp', 'fa-solid', 'fa-caret-down', 'shareArrow');
		const faPlus = document.createElement('button');
		faPlus.classList.add('fa-solid', 'fa-plus', 'fa-lg', 'faIcon');

		movieTitle.innerText = results[i].title;
		movieRating.innerHTML = `<span>Rating:</span> ${results[i].vote_average}`;
		movieDate.innerHTML = results[i].release_date;
		shareMenu.style.backgroundColor = '#fff';

		movieInfo.append(movieRating);
		movieInfo.append(movieCircle);
		movieInfo.append(movieDate);
		faIcons.append(faHeart);
		faIcons.append(faShare);
		faShare.appendChild(shareMenu);
		shareMenu.appendChild(shareArrow);
		faIcons.append(faPlus);
		trailerContainer.append(faIcons);
		videoContainer.append(trailerContainer);
		movieText.append(movieTitle);
		movieText.append(movieInfo);
		videoContainer.append(movieText);
		videosContainer.appendChild(videoContainer);
		getVideo(movieId, trailerContainer);
	}
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

document.addEventListener('DOMContentLoaded', () => {
	getMovies();

});

window.onload = function () {
	const tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};