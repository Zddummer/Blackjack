/*
    Blackjack app
    
    @author Zach Dummer
*/

// Card Variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight',
              'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

// DOM variables              
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

// Game Variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    tie = false;
    dealerCards = [],
    playerCards = [],
    deck = [],
    dealerScore = 0,
    playerScore = 0;

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  tie = false;
  
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  
  checkBlackJack();
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck(){
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++){
    for(let valIdx = 0; valIdx < values.length; valIdx++){
      let card = {
        suit: suits[suitIdx],
        value: values[valIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for(let i = 0; i < deck.length; i++){
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card){
  return card.value + ' of ' + card.suit;
}

function getCardNumericValue(card){
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray){
  let score = 0;
  let hasAce = false;
  for(let i = 0; i < cardArray.length; i++){
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if(card.value === 'Ace'){
      hasAce = true;
    }
  }
  if(hasAce && score + 10 <= 21){
    return score +10;
  }
  return score;
}

function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkBlackJack(){
  if(getScore(playerCards) === 21 && getScore(dealerCards) === 21) {
    tie = true;
    gameOver = true;
  }  else if(getScore(playerCards) === 21){
    playerWon = true;
    gameOver = true;
  } else if (getScore(dealerCards) === 21){
    gameOver = true
  }
  checkForEndOfGame();
}

function checkForEndOfGame(){
  updateScores();
  
  if(gameOver){
    while(dealerScore < 17 && playerScore <= 21){
      dealerCards.push(getNextCard());
      updateScores();
    }
  }
  
  if(playerScore > 21){
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21){
    playerWon = true;
    gameOver = true;
  } else if (gameOver){
    if (playerScore > dealerScore){
      playerWon = true;
    } else if(playerScore === dealerScore){
      tie = true;
    } else {
      playerWon = false;
    }
  }
}

function showStatus(){
  if(!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for(let i = 0; i < dealerCards.length; i++){
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  
  let playerCardString = '';
  for(let i = 0; i < playerCards.length; i++){
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  
  updateScores();
  
  if(dealerCards.length === 2 && !gameOver){
    dealerCardString = '';
    for(let i = 1; i < dealerCards.length; i++){
      dealerCardString += getCardString(dealerCards[i]) + '\n';
    }
    
    updateScores();
    let dealerShowingScore = getScore(dealerCards) - 
                              getCardNumericValue(dealerCards[0]) + 10;
    if(dealerShowingScore > 21){
      dealerShowingScore -= 11;
    }

    textArea.innerText =
      'Dealer showing:\n' +
      dealerCardString +
      '(score: ' + dealerShowingScore + ')\n\n' +
    
      'Player has:\n' +
      playerCardString +
      '(score: ' + playerScore + ')\n\n';
  } else {
    textArea.innerText =
      'Dealer has:\n' +
      dealerCardString +
      '(score: ' + dealerScore + ')\n\n' +
    
      'Player has:\n' +
      playerCardString +
      '(score: ' + playerScore + ')\n\n';
  }
  
  if(gameOver){
    if(playerWon){
      textArea.innerText += "YOU WIN!";
    } else if (tie){
      textArea.innerText += "PUSH"
    } else {
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

function getNextCard(){
  return deck.shift();
}