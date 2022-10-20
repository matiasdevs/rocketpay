import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

function setCardType(type){
  const colors = {
    visa: ['white', 'blue'],
    mastercard: ['orange', 'red'],
    amex: ['#0077A6', '#40ACC3'],
    default: ['black', 'grey'],
  }

  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `cc-${type}.svg`)
}
globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
  mask: '0000',
}
const securityCodeMasked = IMask (securityCode, securityCodePattern);

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
  mask: 'MM/YY',
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12
      },

      YY: {
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String(new Date().getFullYear() + 10).slice(2),
      }
    }
}
const expirationDateMasked = IMask (expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardtype: 'visa',
    },
      {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard',
    },
      {
      mask: '0000 0000 0000 0000',
      regex: /^3[47]\d{13,14}$/,
      cardtype: 'amex',
    },
        {
      mask: '0000 0000 0000 0000',
      cardtype: 'default',
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'');
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex);
    });

    console.log(foundMask);
    return foundMask;
  }
}
const cardNumberMasked = IMask (cardNumber, cardNumberPattern);

// atribuiçao dos dados acima para o cartão

//NOME
const addButton = document.querySelector('#add-card');
addButton.addEventListener('click', function(){
  alert('Cartão Adicionado');

})

const submitForm = document.querySelector('form');
submitForm.addEventListener('submit', function(submitForm){
  
  submitForm.preventDefault();
})

let cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', function(){
    const ccHolder = document.querySelector('.cc-holder .value');
    ccHolder.innerText = cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value;
  })

//CVC
function updateSecurityCode(code){
    const ccSecurity = document.querySelector('.cc-security .value');
  ccSecurity.innerText = code.length === 0 ? '123' : code;
}
securityCodeMasked.on('accept', function(){
  updateSecurityCode(securityCodeMasked.value);  
})

//MUMERO DO CARTAO
function updateCardNumber(number){
  const ccNumber = document.querySelector('.cc-number');
  ccNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number;
}
cardNumberMasked.on('accept', function(){
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
  
})

//EXPIRACAO
function updateExpirationDate(date){
  const ccExpiration = document.querySelector('.cc-extra .value');
  ccExpiration.innerText = date.length === 0 ? '02/32' : date;
}
expirationDateMasked.on('accept', function(){
updateExpirationDate(expirationDateMasked.value);
})
