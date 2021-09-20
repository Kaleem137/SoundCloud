// 1. Search

var UI = {};

UI.handleEnterPress = function () {
  document
    .querySelector(".js-search")
    .addEventListener("keypress", function (e) {
      if (e.which === 13) {
        var inputValue = e.target.value;
        // onValueRead( inputValue );
        //console.log(inputValue);
        soundCloudAPI.getTrack(inputValue);
      }
    });
};

UI.handleSubmitClick = function () {
  document.querySelector(".js-submit").addEventListener("click", function (e) {
    var inputValue = document.querySelector(".js-search").value;
    //onValueRead( inputValue );
    //console.log(inputValue);
    soundCloudAPI.getTrack(inputValue);
  });
};

// // set up the search
UI.handleEnterPress();
UI.handleSubmitClick();

// 2. Query soundcloud api
var soundCloudAPI = {};

soundCloudAPI.init = function () {
  SC.initialize({
    client_id: "cd9be64eeb32d1741c17cb39e41d254d",
    // redirect_uri: "https://kaleemullah.engineer",
  });
};
soundCloudAPI.init();

soundCloudAPI.getTrack = function (inputValue) {
  SC.get("/tracks", {
    q: inputValue,
  }).then(function (tracks) {
    console.log(tracks);

    var searchResult = document.querySelector(".js-search-results");
    searchResult.innerHTML = "";

    soundCloudAPI.renderTrack(tracks);
  });
};

// 3.Display the cards
soundCloudAPI.renderTrack = function (tracks) {
  tracks.forEach(function (track) {
    // CARD
    var card = document.createElement("div");
    card.classList.add("card");

    var searchResults = document.querySelector(".js-search-results");
    searchResults.appendChild(card);

    // CARD__IMAGE
    var image = document.createElement("div");
    image.classList.add("image");

    var imageDiv = document.querySelector("div.card:last-child");
    imageDiv.appendChild(image);
    // IMAGE__DIV
    var image_img = document.createElement("div");
    image_img.classList.add("image_img");
    image_img.src = track.artwork_url; // PROBLEM

    var image_imgDiv = document.querySelector("div.card:last-child .image");
    image_imgDiv.appendChild(image_img);

    // CARD__CONTENT
    var content = document.createElement("div");
    content.classList.add("content");

    var contentDiv = document.querySelector("div.card:last-child");
    contentDiv.appendChild(content);
    // CONTENT__DIV
    var header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML =
      '<a href="' +
      track.permalink_url +
      '" target="_blank">' +
      track.title +
      "</a>";

    var contentDiv_header = document.querySelector(
      "div.card:last-child .content"
    );
    contentDiv_header.appendChild(header);

    // CARD__UI
    var ui = document.createElement("div");
    ui.classList.add("ui", "botttom", "attached", "button", "js-button");

    var uiDiv = document.querySelector("div.card:last-child");
    uiDiv.appendChild(ui);
    // UI__DIV
    var uiDiv_img = document.createElement("i");
    uiDiv_img.classList.add("add", "icon");
    var uiDiv_span = document.createElement("span");
    uiDiv_span.innerHTML = "Add to playlist";

    var uiDiv_selector = document.querySelector("div.card:last-child .ui");
    uiDiv_selector.appendChild(uiDiv_img);
    uiDiv_selector.appendChild(uiDiv_span);

    uiDiv_selector.addEventListener("click", function () {
      soundCloudAPI.getEmbed(track.permalink_url);
    });
  });
};

// 4.Add to Playlist
soundCloudAPI.getEmbed = function (trackURL) {
  SC.oEmbed(trackURL, {
    auto_play: true,
  }).then(function (embed) {
    console.log("oEmbed response: ", embed);

    var sideBar = document.querySelector(".js-playlist");

    var box = document.createElement("div");
    box.innerHTML = embed.html;

    sideBar.insertBefore(box, sideBar.firstChild);
    localStorage.setItem("key", sideBar.innerHTML);
  });
};

var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");
