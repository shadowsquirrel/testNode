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

// wallet.checkProviders = () => {
//
//     // check if providers object exists (does not exist for math wallet)
//     if()
//
// }



// METAMASK
$('#button-1').click(async function() {

    if(window.ethereum && (window.ethereum.providers != undefined)) {

        var metaMaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);

        console.log(metaMaskProvider);

        await metaMaskProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            update.text('account requested', 11)

            update.text(accounts, 12)

            myAccount.push(accounts);

            console.log('');
            console.log('');
            console.log('CONNECT');
            log(myAccount)

        })

    } else {

        update.text('No metamask wallet', 11)

    }
})

// SWITCH TO BINANCE CHAIN
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

// SWITCH TO ETH CHAIN -> DOES NOT WORK!
$('#button-201').click(async function() {

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x1',
                            chainName: 'Ethereum Network',
                            rpcUrls: ['	https://rpc.ankr.com/eth'] /* ... */,
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

// SHOW ACTIVE PROVIDER ACCOUNT
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

// SHOW ACTIVE CHAIN ID OF ACTIVE WALLET
$('#button-4').click(async function() {

    await window.ethereum
    .request({
        method: 'eth_chainId',
    })
    .then((myChainId) => {

        update.text(myChainId, 41)

    })

})

// COINBASE
$('#button-5').click(async function() {

    if(window.ethereum && (window.ethereum.providers != undefined))  {

        // var otherProvider = window.ethereum.providers.find((provider) => !provider.isMetaMask);
        var coinBaseProvider = window.ethereum.providers.find((provider) => provider.isCoinbaseWallet);

        console.log(coinBaseProvider);

        await coinBaseProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            update.text(accounts, 51)

            myAccount.push(accounts);

            console.log('');
            console.log('');
            console.log('CONNECT');
            log(myAccount)

        })
    } else {
        update.text('no coinbase wallet', 51)
    }

})

// MATH WALLET
$('#button-6').click(async function() {

    // window.ethereum.isMathWallet
    if(window.ethereum && window.ethereum.isMathWallet) {
        await window.ethereum
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            update.text(accounts, 61)

            myAccount.push(accounts);

            console.log('');
            console.log('');
            console.log('CONNECT');
            log(myAccount)

        })
    } else {
        update.text('No math wallet', 61)
    }




})

// BINANCE CHAIN
$('#button-8').click(async function() {

    if(window.BinanceChain != undefined) {
        await window.BinanceChain
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            update.text(accounts, 81)

            myAccount.push(accounts);

            console.log('');
            console.log('');
            console.log('CONNECT');
            log(myAccount)

        })
    } else {
        update.text('No Binance wallet', 81)
    }

})

// COIN98 WALLET
$('#button-9').click(async function() {

    if(window.ethereum && window.ethereum.isCoin98) {

        await window.ethereum
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            update.text(accounts, 91)

            myAccount.push(accounts);

            console.log('');
            console.log('');
            console.log('CONNECT');
            log(myAccount)

        })

    } else {
        update.text('No coin98 wallet', 91)
    }

})

// PHANTOM CHAIN CONNECT
$('#button-10').click(async function() {

    console.log('asdasdasdasdasd');

    if(window.solana != undefined && window.solana.isPhantom) {

        console.log('123123123123123');

        // let resp = await window.solana.connect();
        // console.log(resp);
        // update.text(resp.publicKey.toString(), 101)

        // const resp = await window.solana.request({ method: "connect" });
        // resp.publicKey.toString()

        await window.solana.request({ method: "connect" })
        .then(({ publicKey }) => {
            console.log(publicKey);
            // console.log(publicKey.toString());

        });


    } else {
        update.text('No Phantom wallet', 101)
    }

})

// ADDITIONAL SOLANA ACTION TO MAKE THINGS WORK BUT IN VAIN
window.solana.on("connect", () => {

    console.log("connected!");
    console.log(window.solana.publicKey.toString());

})
// window.solana.publicKey.toString()

// PHANTOM CHAIN DISCONNECT
$('#button-11').click(async function() {

    console.log('asdasdasdasdasd');

    if(window.solana != undefined && window.solana.isPhantom) {

        console.log('123123mjhkjhkj123123123');

        // let resp = await window.solana.connect();
        // console.log(resp);
        // update.text(resp.publicKey.toString(), 101)

        // const resp = await window.solana.request({ method: "connect" });
        // resp.publicKey.toString()

        window.solana.request({ method: "disonnect" })

        // .then((accounts) => {
        //
        //     console.log('asdasdasdasdasd1231231231');
        //     update.text(accounts, 101)
        //
        //     myAccount.push(accounts);
        //
        //     console.log('');
        //     console.log('');
        //     console.log('CONNECT');
        //     log(myAccount)
        //
        // })

    } else {
        update.text('No Phantom wallet', 101)
    }

})

// ACCOUNT CHANGE LISTENER
var counter = 0;
window.ethereum.on('accountsChanged', async () => {

    console.log('testint testing testin');

    counter++;

    update.text(('account is changed ' + counter), 71);

});


var node = parent.node;
var W = parent.W;


setTimeout(()=>{
    W.adjustFrameHeight();
}, 10000)
// web3.eth.accounts.wallet
// console.log(web3.eth.accounts.wallet);
