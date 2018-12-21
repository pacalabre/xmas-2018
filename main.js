const pageTitle = document.getElementById('pageTitle');
const shadowOne = document.getElementById('shadowOne');
const shadowTwo = document.getElementById('shadowTwo');

const video = document.getElementById('video');
const progressBar = document.getElementById('progressBar');
const playBtns = document.getElementsByClassName('play-pause');
const playPauseIcons = document.getElementsByClassName('play-pause-icon');
const fastForwardBtn = document.getElementById('fastForwardBtn');
const rewindBtn = document.getElementById('rewindBtn');
const volume = document.getElementById('volumeControl');
const volumeDown = document.getElementById('volumeDown');
const volumeUp = document.getElementById('volumeUp');

let tagsArr = [];
let gridItems = $('.grid').children();
let filterMenu = $('.filter-menu-button-container');
let allCategories = $('#showAllButton');

/* Title Hover */
pageTitle.addEventListener('mousemove', function(e) {
    changeY(e);
    changeX(e);
})

function changeY(e) {
    if( e.clientY > 102) {
        shadowOne.style.top = '-70px';
        shadowTwo.style.top='-65px';
    } else if(e.clientY < 102 ) {
        shadowOne.style.top = '-65px';
        shadowTwo.style.top='-70px';
    } 
}

function changeX(e) {
    if(e.clientX > pageTitle.offsetWidth/2) {
        shadowOne.style.left = `5px`;
        shadowTwo.style.left = `21px`;
    } else if (e.clientX < pageTitle.offsetWidth/2) {
        shadowOne.style.left = `21px`;
        shadowTwo.style.left = `5px`;
    }
}

/* Video Player */

video.controls = false;

let arr = [];
arr.push(video)
console.log(arr);

for (playBtn of playBtns) {
    playBtn.addEventListener('click', function() {
        togglePlayPauseIcon();
        if(video.paused || video.ended) {
            video.play();
        } else {
            video.pause();
        }
    })
}

video.addEventListener('timeupdate', updateProgressBar);

fastForwardBtn.addEventListener('click', function() {
    video.currentTime = video.currentTime + 15;
})

rewindBtn.addEventListener('click', function() {
    video.currentTime = video.currentTime - 15;
})

volume.oninput = function() {
    video.volume = this.value;
    console.log(video.volume);
}

volumeDown.addEventListener('click', function() {
    video.volume = parseFloat(video.volume).toFixed(1);
    if (video.volume === 0) {
        return;
    } else {
        video.volume = video.volume - .1;
    }
    console.log(video.volume);
})

volumeUp.addEventListener('click', function() {
    video.volume = parseFloat(video.volume).toFixed(1);
    if (video.volume === 1) {
        return;
    } else {
        video.volume = video.volume + .1;
    }
    console.log(video.volume);
})

function togglePlayPauseIcon() {
    for( playPauseIcon of playPauseIcons) {
        playPauseIcon.classList.toggle('hide');
    }
}

function updateProgressBar() {
    let percentage = Math.floor((100/video.duration) * video.currentTime );
    console.log(percentage);
    progressBar.value = percentage;
    progressBar.innerHTML = percentage;
}



/* Grid JS */

function initalizeGrid() {
    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 1,
        fitWidth: true
    });
}

$('#filterButton').on('click', function() {
    $('.filter-menu').toggleClass('show');
    $('#filterButton').toggleClass('active');
}) 

/* Close the menu if you click away from it */

$(document).click(function(event) {
  if (!$(event.target).closest(".filter-menu,.filter-container").length) {
    $("body").find(".filter-menu").removeClass("show");
    $('#filterButton').removeClass('active');
  }
}); 

/* Collect tags */

gridItems.each(function(index,gridItem) {
    let itemTag = gridItems[index].dataset.tags;
    if (!tagsArr.includes(itemTag)){
        tagsArr.push(itemTag);
    }
}) 

/* Create Buttons from Tags */

for( tag in tagsArr) {
    let buttonId = tagsArr[tag].replace(/\s/g, '');
    let button = document.createElement('button');
    button.className = 'filter-menu-button';
    button.innerHTML = tagsArr[tag].toLowerCase();
    filterMenu.append(button);
    button.onclick = dynamicTagButtons;
    button.id = buttonId;
}

/* Click Events for Dynamic Buttons */

function dynamicTagButtons() {
    let buttonClicked = $(this);
    resetGridClasses();
    $(buttonClicked).addClass('active');
    updateCategoryText(buttonClicked);
    gridItems.each(function(index,gridItem) {
        let itemTag = gridItems[index].dataset.tags;
        if (itemTag === buttonClicked.text()){
            return;
        } else {
            $(gridItem).addClass('hide');
            initalizeGrid();
        }
    })
}

function updateCategoryText(tag) {
    let firstLetterRx = tag.text();
    let uppercaseFirstLetter = firstLetterRx.replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
    $('.filter-container-right-text').empty();
    $('.filter-container-right-text').text(uppercaseFirstLetter);
}

function resetGridClasses() {
    $('.filter-menu-button').removeClass('active');
    gridItems.each(function(index,gridItem) {
        $(gridItem).removeClass('hide');
    })
}

$('#showAllButton').on('click', function() {
    updateCategoryText(allCategories);
    $('.filter-menu-button').removeClass('active');
    gridItems.each(function(index,gridItem) {
        $(gridItem).removeClass('hide');
    })
    initalizeGrid();
})

/* Deep Linking */

var getTheHashInUrl = function () {
    var hash = window.location.hash;
    let stringToArr = hash.split('');
    let removeHashFromStr =  stringToArr.splice(1, stringToArr.length).join('').toLowerCase();
    $('#'+ removeHashFromStr).click();
};

$(window).on('load', getTheHashInUrl);

/* Initialize grid on load */

initalizeGrid();

 

