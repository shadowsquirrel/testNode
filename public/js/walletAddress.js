// $('#text').html('Henrikin gotunu sikiyim liniancisini sikiyim orospu pici')
//
//
// var onboarding = new MetaMaskOnboarding();
// var accounts;


// $('#request-address').click( async () => {
//
//     await window.ethereum.request({
//         method: 'eth_requestAccounts',
//     })
//     .then(function(accounts) {
//         console.log('what is this accounts -> ' + accounts);
//     })
//
// })
//
//
//
//
// window.ethereum.on('accountsChanged', function(newAccounts) {
//
//     accounts = newAccounts;
//     updateButton();
//
// });



// METAMASK.
////////////

// import MetaMaskOnboarding from '@metamask/onboarding';

// var onboarding = new MetaMaskOnboarding();
// var onboardButton = document.getElementById('onboard');
// var accounts;
// var metamaskAddress;
//
// function updateButton() {
//
//     if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
//
//         // TO DO: receive 'Install MetaMask' string from node given lang
//         onboardButton.innerText = 'Install MetaMask';
//         // onboardButton.innerText = lang.installMM;
//
//         onboardButton.onclick = function() {
//
//             onboardButton.innerText = 'connecting';
//             // TO DO: receive 'connecting' string from node given lang
//             // onboardButton.innerText = lang.connecting;
//             onboardButton.disabled = true;
//
//             // directs to metamask add on page
//             // listens for the metamask to be available
//             onboarding.startOnboarding();
//
//         };
//
//     }
//     else if (accounts && accounts.length > 0) {
//
//     // if (accounts && accounts.length > 0) {
//
//         onboardButton.innerText = '✔ ...' + accounts[0].slice(-4);
//         onboardButton.disabled = true;
//         onboarding.stopOnboarding();
//
//         metamaskAddress = accounts[0]
//
//         // debug
//         console.log('Received metamask address - 1');
//         console.log(metamaskAddress);
//         console.log('sending address to player.js');
//         console.log('what is this accounts -> ' + accounts);
//
//
//     }
//     else {
//
//         onboardButton.innerText = 'Connect';
//
//         onboardButton.onclick = async () => {
//             try {
//
//                 await window.ethereum.request({
//                     method: 'eth_requestAccounts',
//                 })
//                 .then(function(accounts) {
//
//                     onboardButton.innerText = `✔ ...${accounts[0].slice(-4)}`;
//                     onboardButton.disabled = true;
//
//                     metamaskAddress = accounts[0]
//
//                     // debug
//                     console.log('Received metamask address - 2');
//                     console.log(metamaskAddress);
//                     console.log('sending address to player.js');
//                     console.log('what is this accounts -> ' + accounts);
//
//                 })
//
//             }
//             catch(error) {
//                 console.log('we have an error: ');
//                 console.log(error);
//                 // TO DO: update from node for the error string
//                 window.alert('some error message to receive from node');
//                 // window.alert(lang.error);
//             };
//         };
//     }
//
//
//
//
// };
//
// updateButton();
//
// if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//
//     window.ethereum.on('accountsChanged', function(newAccounts) {
//
//         accounts = newAccounts;
//         updateButton();
//
//     });
// }







//////////////////////////
//
// window.addEventListener('DOMContentLoaded', () => {
//
//   const onboarding = new MetaMaskOnboarding();
//   const onboardButton = document.getElementById('onboard');
//   let accounts;
//
//   const updateButton = () => {
//     if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
//       onboardButton.innerText = 'Click here to install MetaMask!';
//       // onboardButton.onclick = () => {
//       //   onboardButton.innerText = 'Onboarding in progress';
//       //   onboardButton.disabled = true;
//       //   onboarding.startOnboarding();
//       // };
//       onboardButton.onclick = async () => {
//         await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });
//       };
//     } else if (accounts && accounts.length > 0) {
//       onboardButton.innerText = 'Connected';
//       onboardButton.disabled = true;
//       onboarding.stopOnboarding();
//     } else {
//       onboardButton.innerText = 'Connect';
//       onboardButton.onclick = async () => {
//         await window.ethereum.request({
//           method: 'eth_requestAccounts',
//         });
//       };
//     }
//   };
//
//   updateButton();
//
//   if (MetaMaskOnboarding.isMetaMaskInstalled()) {
//     window.ethereum.on('accountsChanged', (newAccounts) => {
//       accounts = newAccounts;
//       updateButton();
//     });
//   }
// });

// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// console.log(web3);

// web3.setProvider('ws://localhost:8546');
// web3.eth.getAccounts().then(console.log);
