
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

    var isMM, isCB

    // METAMASK CHECK
    if(window.ethereum && (window.ethereum.providers != undefined)) {
        isMM = (window.ethereum.providers.find((provider) => provider.isMetaMask) != undefined)
    } else {
        isMM = false;
    }


    // COINBASE CHECK
    if(window.ethereum && (window.ethereum.providers != undefined)) {
        isCB = (window.ethereum.providers.find((provider) => provider.isCoinbaseWallet) != undefined);
    } else {
        isCB = false;
    }


    // MATH WALLET CHECK -> NOTE FOR BITCOIN WE CAN HAVE A MATH WALLET BUT WE ARE NOT SURE YET
    var isMW_1 = window.ethereum && window.ethereum.isMathWallet;
    var isMW_2 = window.solana && window.solana.isMathWallet;
    var isMW = isMW_1 || isMW_2;

    // BINANCE WALLET CHECK -> not sure if this is the only case
    var isBC = window.BinanceChain != undefined;


    var isC98 = window.ethereum && window.ethereum.isCoin98;

    // SOLFLARE CHECK
    var isSF = window.solflare && window.solflare.isSolflare;

    // TRON CHECK -> FOR ANY WALLET

    // SOLANA CHECK -> FOR ANY WALLET

    // COSMOS CHECK -> FOR ANY WALLET

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

// SOLFLARE
$('#button-sf').click(async function() {

    await window.solflare.connect()
    .then((promise)=>{
        console.log('solfare');
        if(promise) {
            update.text(window.solflare.publicKey.toString(), 'sf');
        } else {
            update.text('Permission denied', 'sf');
        }



    })
})

// KEPLR
$('#button-kp').click(async function() {

    var chainId = "cosmoshub-4";

    await window.keplr.enable(chainId);

    var offlineSigner = window.keplr.getOfflineSigner(chainId);

    await offlineSigner
    .getAccounts()
    .then((accounts)=>{
        console.log(accounts);
        var addresses = accounts.map(i => i.address)
        console.log(accounts[0].address);
        console.log(addresses);
        update.text(addresses, 'kp')
    });

})

// FAILED SOLLET ACTION
// let connection = new Connection(clusterApiUrl('devnet'));
// let providerUrl = 'https://www.sollet.io';
// wallet.sollet = new Wallet(providerUrl);
// wallet.sollet.on('connect', publicKey => console.log('Connected to ' + publicKey.toBase58()));
// wallet.sollet.on('disconnect', () => console.log('Disconnected'));
// await wallet.sollet.connect();

$('#button-test').click(async function() {

    // try {
    //     const resp = await window.solana.request({ method: "connect" });
    //     resp.publicKey.toString()
    //     // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
    // } catch (err) {
    //     // { code: 4001, message: 'User rejected the request.' }
    // }

    // await window.solana
    // .getAccount()
    // .then((address)=>{
    //
    //      update.text(address, 'test');
    //
    // })


})
// MATH WALLET
var mw = {}
mw.check = ()=>{
    var isPolkadot = (window.injectedWeb3 && window.injectedWeb3.mathwallet);
    // window.injectedWeb3.enable()
    // var isSolana =
}
$('#button-6').click(async function() {


    // await window.BinanceChain
    // .request({
    //     method: 'eth_requestAccounts',
    // })
    // .then((accounts) => {
    //
    //     update.text(accounts, 81)
    //     myAccount.push(accounts);
    //     log(myAccount)
    //
    // })


    // window.solana && window.solana.isMathWallet
    await window.solana
    .getAccount()
    .then((address)=>{

         update.text(address, 61);
         update.text('Solana', 62)

    })
    // if(window.ethereum && window.ethereum.isMathWallet) {
    //
        // await window.ethereum
        // .request({
        //     method: 'eth_requestAccounts',
        // })
        // .then((accounts) => {
        //
        //     update.text(accounts, 61)
        //     myAccount.push(accounts);
        //     log(myAccount)
        //     update.text(window.ethereum.chainId, 62);
        //     update.text(window.ethereum.address, 63)
        //
        // })
    //
    // } else {
    //     update.text('No math wallet', 61)
    // }

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

wc.provider = new WalletConnectProvider.default({
  rpc: {
    1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
    56: "https://bsc-dataseed.binance.org/",
    137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
    43114: "https://api.avax.network/ext/bc/C/rpc",
    1666600000: "https://api.harmony.one",
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
      mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
          // 'in'
      ],
  },
});
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
      qrcodeModalOptions: {
          mobileLinks: [
              "rainbow",
              "metamask",
              "argent",
              "trust",
              "imtoken",
              "pillar",
              // 'in'
          ],
      },
  });

    console.log('inside wc.connect');

    try {
        await wc.provider
        .enable()
        .then((address)=>{

            update.text(address, 121);
            wc.web3 = new Web3(wc.provider);
            console.log('wc.web3');
            console.log(wc.web3);
            // console.log(wc.web3.givenProvider.chainId);
            // console.log(wc.web3.eth.getChainId().then((myPro)=>{console.log(myPro);}));
            wc.web3.eth.getChainId().then((myPro)=>{console.log(myPro);})
            console.log('----');
            // await window.ethereum


        })
        .then(()=> {
            // wc.provider.disconnect();
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

wc.provider.on("connect", (error, payload) => {

    console.log('connect walletConnect');
    console.log(payload);

});

wc.provider.on("chainChanged", (chainId) => {

    console.log('chain changed walletConnect');
    console.log(chainId);

});
// disconnect listener
wc.provider.on("accountsChanged", (accounts) => {

    console.log('accounts changed walletConnect');
    console.log(accounts);

});

// disconnect listener
wc.provider.on("disconnect", (code, reason) => {

    console.log('asdasdasdasd12312asd436gf');
    console.log(code, reason);

});

// TORUS WALLET

$('#button-13').click(async function() {

    console.log('torus button clicked');

    const torus = new Torus();
    await torus.init();
    await torus.login();

    console.log(torus.provider);
    var mato = torus.provider
    console.log(mato);
    update.text(torus.provider.selectedAddress, 131)
    update.text('chain: ' + torus.provider.chainId, 132)

})

// ACCOUNT CHANGE LISTENER
var counter = 0;
window.ethereum.on('accountsChanged', async () => {

    counter++;
    update.text(('account is changed ' + counter), 01);

});
