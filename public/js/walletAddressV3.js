
var node = parent.node;
var W = parent.W;

var update = {}
var wallet = {
    address: {}
}
var chain = {}
var check = {
    dot: undefined,
    eth: undefined,
    ada: undefined,
    sol: undefined
}

// chain.dot = injectedWeb3;
// injectedWeb3.clover.enable()
// .then((res)=>{
//     var cloverWallet = res.accounts.get();
//     console.log(cloverWallet);
//     return cloverWallet
// })
// .then((res)=>{
//     console.log(res[0].address)
//     wallet.address.clover = res[0].address
// })

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

// ETHEREUM
var isMM = false;
var isCB = false;

// MULTI CHAIN
var isMW = {
    any: false,
    eth: false,
    btc: false,
    sol: false,
    tron: false,
    cosmos: false,
    binance: false,
    dot: false,
    fantom: false,
};
var isC98 = {
    any: false,
    eth: false,
    sol: false,
    binance: false,
    ronin: false,
    kardia: false,
    avax: false,
    fantom: false,
};
var isClover = {
    dot: false,
    sol: false,
    tron: false,
    kadena: false,
}

// CARDANO
var isYoroi = false;
var isNami = false;

// POLKADOT
var isDotJS = false;

// BINANCE
var isBC = false;

// SOLANA
var isSF = false;

//---//
// to replace the window object in the html level with the window object
// at the parent
var win = undefined;

node.on('client-window', (msg) => {
    win = msg;
})
node.emit('html-window');
//---//



wallet.check = () => {

    // ETH WALLET DETECTION
    if(window.ethereum) {

        // single eth wallet
        if(window.ethereum.providers === undefined) {

            console.log('--------------------------------');
            console.log('----- SINGLE ETH PROVIDER ------');
            console.log('--------------------------------');

            if(window.ethereum.isMathWallet) {

                console.log('MATH WALLET ETH DETECTED');
                isMW = true;

            } else if(window.ethereum.isCoin98) {

                console.log('COIN98 WALLET ETH DETECTED');

            } else if(window.ethereum.isCoinBaseWallet) {

                console.log('COINBASE WALLET ETH DETECTED');
                isCB = true;

            } else if(window.ethereum.isMetaMask) {

                console.log('METAMASK WALLET ETH DETECTED');
                isMM = true;

            }

            // multiple eth wallets
        } else {

            console.log('---------------------------------');
            console.log('- MULTIPLE ETH WALLETS DETECTED -');
            console.log('---------------------------------');

            if((window.ethereum.providers.find((provider) => provider.isMetaMask) != undefined)) {

                console.log('METAMASK WALLET ETH DETECTED');
                isMM = true;

            }

            if((window.ethereum.providers.find((provider) => provider.isCoinbaseWallet) != undefined)) {

                console.log('COINBASE WALLET ETH DETECTED');
                isCB = true;

            }
        }

    }

    // DOT WALLET DETECTION
    if(win.injectedWeb3 != undefined) {

        var keys = Object.keys(win.injectedWeb3);
        console.log(keys.length + ' dot wallets: ' + keys);

        isMW.dot = keys.includes('mathwallet');
        isClover.dot = keys.includes('clover')
        isDotJS = keys.includes('polkadot-js');

        console.log(win.injectedWeb3['polkadot-js']);

    }


    // BINANCE WALLET CHECK -> not sure if this is the only case
    isBC = window.BinanceChain != undefined;

    // MATH WALLET CHECK -> NOTE FOR BITCOIN WE CAN HAVE A MATH WALLET BUT WE ARE NOT SURE YET
    isMW.eth = window.ethereum && window.ethereum.isMathWallet;
    isMW.sol = window.solana && window.solana.isMathWallet;
    isMW.any = isMW.eth || isMW.sol || isMW.dot;

    // COIN98
    isC98.eth = window.ethereum && window.ethereum.isCoin98;
    isC98.any = isC98.eth;


    // --- SOLANA ONLY WALLETS --- //

    // SOLFLARE CHECK
    isSF = window.solflare && window.solflare.isSolflare;

    // PHANTOM CHECK
    isPh = window.solana && window.solana.isPhantom;

    // --- COSMOS --- //
    isKp = window.keplr != undefined;

    // TRON CHECK -> FOR ANY WALLET

    // SOLANA CHECK -> FOR ANY WALLET

    // COSMOS CHECK -> FOR ANY WALLET



}

wallet.showActiveButtons = () => {

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

    if(!isMW.any) {
        wallet.hide('mw');
    } else {
        wallet.show('mw')
    }

    if(!isBC) {
        wallet.hide('bc');
    } else {
        wallet.show('bc')
    }

    if(!isC98.any) {
        wallet.hide('c98');
    } else {
        wallet.show('c98')
    }

    if(!isPh) {
        wallet.hide('ph');
    } else {
        wallet.show('ph')
    }

    if(!isSF) {
        wallet.hide('sf');
    } else {
        wallet.show('sf')
    }

    if(!isKp) {
        wallet.hide('kp');
    } else {
        wallet.show('kp')
    }


}

wallet.hide = (id) => {
    $(('.button-' + id)).css({'display':'none'});
}
wallet.show = (id) => {
    $(('.button-' + id)).css({'display':''});
}


wallet.testAda = async () => {

    var myAdaApi, unused, used, all;

    await cardano.yoroi.enable()
    .then((api) => {

        myAdaApi = api;
        return myAdaApi.getUsedAddresses();

    })
    .then((res) => {

        used = res;
        // used = ['test1231231231231', 'test00hgghghghghg'];
        return myAdaApi.getUnusedAddresses();

    })
    .then((res)=>{

        unused = res;
        all = used;
        unused.forEach(i => all.push(i));

        console.log(all);

    })


}
// wallet.check();

$('#main-connect').click(function() {

    $('.column-1, .column-2').css({'display':'flex'});
    $('#main-connect').css({'display':'none'});

    wallet.check();
    wallet.showActiveButtons();

    // wallet.canTest();

    // wallet.testAda();

    // console.log(myDot);


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
    .then((res)=>{

        console.log('solfare');

        if(res) {
            update.text(window.solflare.publicKey.toString(), 'sf');
        } else {
            update.text('Permission denied', 'sf');
        }

    })

})

// PHANTOM
$('#button-ph').click(async function() {

    await win.solana.connect()
    .then((res)=>{

        console.log('phantom');
        console.log(res);

        if(res) {
            update.text(win.solana.publicKey.toString(), 'ph');
        } else {
            update.text('Permission denied', 'ph');
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


// MATH WALLET
var mw = {}
mw.check = ()=>{
    var isPolkadot = (window.injectedWeb3 && window.injectedWeb3.mathwallet);
    // window.injectedWeb3.enable()
    // var isSolana =
}
$('#button-6').click(async function() {

    if(isMW.eth) {

        await window.ethereum
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            update.text(accounts, 61)
            update.text(window.ethereum.chainId, 62);

        })

    }

    if(isMW.sol) {

        await window.solana
        .getAccount()
        .then((address)=>{

             update.text(address, 61);
             update.text('Solana', 62)

        })

    }

    if(isMW.dot) {

        var myDotAccount, myDotAddress;

        win.injectedWeb3.mathwallet
        .enable()
        .then((res) => {
            myDotAccount = res.accounts.get();
            return myDotAccount;
        })
        .then((res) => {

            myDotAddress = res[0].address;
            update.text(myDotAddress, 61)
            update.text('Polkadot', 62)

        })

    }


    // BINANCE CHAIN CASE

    // TRON CASE

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

    // if(window.ethereum && window.ethereum.isMathWallet) {
    //

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
            update.text(window.ethereum.chainId, 92);
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

$('#text-01').html('asdada <br> asd1231 <br> asdasdas')
