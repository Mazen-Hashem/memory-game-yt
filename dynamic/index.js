// select elements
const startContainer = document.querySelector(".start_container"),
      playerNameInput = document.querySelector(".start_container .player_name_input"),
      startGameBtn = document.querySelector(".start_container .start_game_btn");
const gameContainer = document.querySelector(".game_container"),
      playerName = document.querySelector(".game_container .player_name"),
      wrongCount = document.querySelector(".game_container .wrong_count"),
      main = document.querySelector(".game_container .main");
const endContainer = document.querySelector(".end_container"),
      endText = document.querySelector(".end_container .end_text"),
      resetBtn = document.querySelector(".end_container .reset_btn");
const trueSound = document.querySelector(".true_sound"),
      falseSound = document.querySelector(".false_sound");

// array of images
let images = ["angular.png", "css.png", "github.png", "html.png", "python.png", "react.png", "vue.png", "php.png", "c++.png", "mysql.png"],
    imagesX2 = [],
    imagesX2random = []; // the array that will create the cards

// put the main array inside the second array 2 times. (10 * 2 = 20 index)
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < images.length; j++) {
    imagesX2.push(images[j]);
  };
};

// array for the chosen indexes
let randomIndexArray = [];
for (let i = 0; i < imagesX2.length; i++) {
  random();
  function random() {
    // get random index from imagesX2 array
    let randomIndex = Math.floor(Math.random() * imagesX2.length);
  
    // check if current random index already exist or not
    if (!randomIndexArray.includes(randomIndex)) {
      // if not, put it inside the chosen indexes array
      randomIndexArray.push(randomIndex);
      // get the word that has this index
      let chosenWord = imagesX2[randomIndex];
      // put the chosen word in the imagesX2random array
      imagesX2random.push(chosenWord);
    } else {
      // if yes, run the function again until get valid index
      random();
    };
  };
};


// on load clean input value, focus on it
window.addEventListener("load", _ => {
  playerNameInput.value = "";
  playerNameInput.focus();
});

// handle startGameBtn
startGameBtn.addEventListener("click", _ => {
  //if input value is not empty start game, else focus on it again
if (playerNameInput.value !== "") {
    startGame();
  } else {
    playerNameInput.focus();
  };
});

// inactive startContainer, active gameContainer
function startGame() {
  startContainer.classList.remove("active_start_container");
  gameContainer.classList.add("active_game_container");
  createGame();
};

// create game elements and infos
function createGame() {
  // print input value in p element (player name)
  playerName.innerHTML = playerNameInput.value;

  for (let i = 0; i < imagesX2random.length; i++) {
    // create card
    const card = document.createElement("button");
    card.classList.add("card");

    // create the front face of the card
    const frontCard = document.createElement("div");
    frontCard.classList.add("front_card");
    card.appendChild(frontCard);

    // create the image of the front face of the card
    const cardImage = document.createElement("img");
    cardImage.classList.add("card_image");
    cardImage.src = `static/image/${imagesX2random[i]}`;
    frontCard.appendChild(cardImage);

    // create the back face of the card
    const backCard = document.createElement("div");
    backCard.classList.add("back_card");
    card.appendChild(backCard);

    // create the design of the back face of the card
    const cardIcon = document.createElement("p");
    cardIcon.classList.add("card_icon");
    cardIcon.innerHTML = "?";
    backCard.appendChild(cardIcon);

    // put the card in div element (main)
    main.appendChild(card);
  };
  oneLook();
};

function oneLook() {
  // make array from cards
  const cards = Array.from(document.querySelectorAll(".game_container .card"));
  // active each card after 0.5s from start the game
  cards.forEach(card => {
    setTimeout(() => {
      card.classList.add("active_card");
    }, 500);
  });
  // remove active from each card after 3s from the active
  cards.forEach(card => {
    setTimeout(() => {
      card.classList.remove("active_card");
    },3000);
  });
  // run the function after 3.5s
  setTimeout(() => {
    clickCards(cards);
  }, 3500);
};

function clickCards(cards) {
  // put the two cards that player choose to compare between them
  let arrayAnswers = [];
  cards.forEach(card => {
    // when click on the target card
    card.addEventListener("click", _ => {
      // active it
      card.classList.add("active_card");
      // add disabled attr to stop the click event
      card.setAttribute("disabled", true);
      arrayAnswers.push(card);
      // check if the array has 2 cards or not
      if (arrayAnswers.length === 2) {
        // if yes, run the check function
        checkAnswer(arrayAnswers, cards);
        // empty the array to take the second 2 cards
        arrayAnswers = [];
      };
    });
  });
};

// duration of cards 1s
let duration = 1000;
// counter for right answers
let rightAnswersNumb = 0;
// counter for wrong answers
let wrongAnswersNumb = 0;

// print number of wrong answers in p element
wrongCount.innerHTML = wrongAnswersNumb;

function checkAnswer(arrayAnswers, cards) {
  // the src of the first and second card
  let firstCard = arrayAnswers[0].children[0].children[0].src;
  let secondCard = arrayAnswers[1].children[0].children[0].src;

  // add disabled to all cards to stop the player from clicking the cards while checking the answer
  cards.forEach(card => {
    card.setAttribute("disabled", true);
  });

  // if src image of the first card = src image of the second card
  if (firstCard === secondCard) {
    // +1 the right answers counter
    rightAnswersNumb++;
    // play sound
    trueSound.play();
    setTimeout(() => {
      // if number of right answers = number of main images
      if (rightAnswersNumb === images.length) {
        // run end game function
        endGame();
      };
    }, duration);
  } else {
    // if answer worng: +1 the wrong answers counter
    wrongAnswersNumb++;
    // print the new number of wrong answers in p element
    wrongCount.innerHTML = wrongAnswersNumb;
    // play sound
    falseSound.play();
    setTimeout(() => {
      // remove active and disabled attr from the 2 wrong cards
      arrayAnswers.forEach(answer => {
        answer.classList.remove("active_card");
        answer.removeAttribute("disabled", true);
      });
    }, duration);
  };
  
  setTimeout(() => {
    // after checking the answer, remove disabled from all unactive cards
    cards.forEach(card => {
      if (!card.classList.contains("active_card")) {
        card.removeAttribute("disabled", true);
      };
    });
  }, duration);
};

// remove active from game container, active end game container
function endGame() {
  gameContainer.classList.remove("active_game_container");
  endContainer.classList.add("active_end_container");
  result();
};

function result() {
  // if wrong answers between 0 and 5
  if (wrongAnswersNumb >= 0 && wrongAnswersNumb <= 5) {
    resultRate("excellent", "Excellent Memory");
  // if wrong answers between 6 and 15
  } else if (wrongAnswersNumb >= 6 && wrongAnswersNumb <= 15) {
    resultRate("good", "Good Memory");
  // if wrong answers from 16 and more
  } else if (wrongAnswersNumb >= 16) {
    resultRate("bad", "Bad Memory");
  };

  function resultRate(cls, text) {
    endText.innerHTML = ` <span class="text_head">Congratulations</span> 
                          <span class="text_clr">${playerNameInput.value}</span>, you won after 
                          <span class="text_clr">${wrongAnswersNumb}</span> wrong/s.
                          <span class="rate ${cls}">${text}</span>`;
  };
};

// when click on btn it will reload the page
resetBtn.addEventListener("click", _ => {
  location.reload();
});
