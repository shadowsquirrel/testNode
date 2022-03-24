var update = {}
var wallet = {}

update.text = (newText, idNum) => {

    var span = '#text-' + idNum

    $(span).html(newText);

}

log = (text) => {

    console.log('------------------');
    console.log('');
    console.log('');
    console.log(text);
    console.log('');
    console.log('');
    console.log('------------------');

}

var myAccount = [];


// var onboarding = new MetaMaskOnboarding();
// var accounts;
//
// $('#onboard').click( async () => {
//
//     update.text('Account promise is on...', 1)
//
//     await window.ethereum.request({
//         method: 'eth_requestAccounts',
//     })
//     .then(function(accounts) {
//
//         update.text('Promise is fulfilled!', 1)
//
//         update.text(accounts, 2)
//
//         myAccount.push(accounts);
//
//         console.log('');
//         console.log('');
//         console.log('Onboard button await request then promise fulfilled->');
//         log(myAccount)
//
//
//     })
//
// })
//
//
//
// window.ethereum.on('accountsChanged', function(newAccounts) {
//
//     update.text('Accounts changed promise is fulfilled', 3);
//     accounts = newAccounts;
//     update.text(accounts, 4)
//     myAccount.push(accounts);
//
//
//     console.log('');
//     console.log('');
//     console.log('Accounts changed')
//     log(myAccount)
//
// });


update.text('Text-1', 1);
update.text('Text-2', 2);
update.text('Text-3', 3);
update.text('Text-4', 4);
update.text('Text-5', 5);



var web3 = new Web3(Web3.givenProvider)
// var web3 = new Web3(window.ethereum);





$('#button-1').click(async function() {

    await window.ethereum
    .request({
        method: 'eth_requestAccounts',
    })
    .then((accounts) => {

        update.text('account requested', 11)

        update.text(accounts, 12)

        myAccount.push(accounts);

        console.log('');
        console.log('');
        console.log('CONNECT');
        log(myAccount)

    })

})
$('#button-2').click(async function() {

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x38',
                            chainName: 'Smart Chain',
                            rpcUrls: ['https://bsc-dataseed.binance.org/'] /* ... */,
                        },
                    ],
                });
            } catch (addError) {
                // handle "add" error
            }
        }
        // handle other "switch" errors
    }

})


$('#button-3').click(async function() {

    await window.ethereum
    .request({
        method: 'eth_accounts'
    })
    .then((accounts) => {

        update.text('eth_accounts', 31)

        update.text(accounts, 32)

        myAccount.push(accounts);


        console.log('');
        console.log('');
        console.log('eth_accounts');
        log(myAccount)
        console.log('');
        console.log('');
        console.log('eth.getAccounts');
        web3.eth.getAccounts(console.log);

    })

})

$('#button-4').click(async function() {

    await window.ethereum
    .request({
        method: 'eth_chainId',
    })
    .then((myChainId) => {

    update.text(myChainId, 41)

    })

})

$('#button-5').click(async function() {



})


// web3.eth.accounts.wallet
// console.log(web3.eth.accounts.wallet);
