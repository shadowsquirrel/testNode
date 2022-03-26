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

wallet.check = () => {

    var isMM = window.ethereum && (window.ethereum.providers != undefined);
    var isCB = window.ethereum && (window.ethereum.providers != undefined);
    var isMW = window.ethereum && window.ethereum.isMathWallet;
    var isBC = window.BinanceChain != undefined;
    var isC98 = window.ethereum && window.ethereum.isCoin98;

    if(!isMM) {
        wallet.hide('mm');
    } else {
        wallet.show('mm')
    }

    if(!isCB) {
        wallet.hide('cb');
    } else {
        wallet.show('cb')
    }

    if(!isMW) {
        wallet.hide('mw');
    } else {
        wallet.show('mw')
    }

    if(!isBC) {
        wallet.hide('bc');
    } else {
        wallet.show('bc')
    }

    if(!isC98) {
        wallet.hide('c98');
    } else {
        wallet.show('c98')
    }

}

wallet.hide = (id) => {
    $(('.button-' + id)).css({'display':'none'});
}
wallet.show = (id) => {
    $(('.button-' + id)).css({'display':''});
}


wallet.check();

$('#main-connect').click(function() {
    $('.column-1, .column-2').css({'display':'flex'});
    $('#main-connect').css({'display':'none'});
    wallet.check();
})

window.onload = function() {
    // storing ethereum before it is overridden
    const storage = window.ethereum;
    console.log(storage);
}


// METAMASK
$('#button-1').click(async function() {

    if(window.ethereum && (window.ethereum.providers != undefined)) {

        var metaMaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);

        console.log(metaMaskProvider);

        await metaMaskProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            update.text(accounts, 11);
            myAccount.push(accounts);
            log(myAccount);

        })

    } else {

        update.text('No metamask wallet', 11)

    }
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

            update.text(accounts, 51);
            myAccount.push(accounts);
            log(myAccount);

        })
    } else {
        update.text('no coinbase wallet', 51)
    }

})

// MATH WALLET
$('#button-6').click(async function() {

    if(window.ethereum && window.ethereum.isMathWallet) {

        await window.ethereum
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            update.text(accounts, 61)
            myAccount.push(accounts);
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
            log(myAccount)

        })

    } else {
        update.text('No coin98 wallet', 91)
    }

})

// WALLET CONNECT STUFF

var wc = {}

// wc.provider = new WalletConnectProvider.default({
//   rpc: {
//     1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
//     56: "https://bsc-dataseed.binance.org/",
//     137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
//     43114: "https://api.avax.network/ext/bc/C/rpc",
//     1666600000: "https://api.harmony.one",
//   },
//   bridge: 'https://bridge.walletconnect.org',
// });

// button to connect get address and disconnect
$('#button-12').click(async function() {

    wc.provider = new WalletConnectProvider.default({
      rpc: {
        1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
        56: "https://bsc-dataseed.binance.org/",
        137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
        43114: "https://api.avax.network/ext/bc/C/rpc",
        1666600000: "https://api.harmony.one",
      },
      bridge: 'https://bridge.walletconnect.org',
    });

    console.log('inside wc.connect');

    try {
        await wc.provider
        .enable()
        .then((address)=>{

            update.text(address, 121);

        })
        .then(()=> {
            wc.provider.disconnect();
        })
    } catch (switchError) {
        console.log(switchError.code);
        console.log(switchError);
        wc.provider.disconnect();
    }

})

// button to disconnect
// $('#button-122').click(async function() {
//
//     console.log('disconnect button');
//
//     await wc.provider.disconnect();
//
// })

// disconnect listener
// wc.provider.on("disconnect", (code, reason) => {
//
//     console.log('asdasdasdasd12312asd436gf');
//     console.log(code, reason);
//
// });


// ACCOUNT CHANGE LISTENER
var counter = 0;
window.ethereum.on('accountsChanged', async () => {

    counter++;
    update.text(('account is changed ' + counter), 01);

});
