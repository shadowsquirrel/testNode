// ----------------------------------------------- //
//
// coin98 uses ethereum for: kardia, fantom, ronin and avax
// and this overrides other eth wallets such as metamask and coinbase
//
//
// math wallet also overrides the eth network. When both coin98 and math active
// math overrides coin98 eth network so we only have math wallet active
//
//
// math wallet does not override kelpr wallet (win.kelpr.cosmos)
// math wallet cosmos API is shit and does not work so in case math wallet is used for this
// rather than considering an unknown cosmos wallet button we will simply ignore it
//
//
// for bitcoin I know of 2 multi chain wallets that account for bitcoin network:
// math wallet and liquality. Liquality is not popular and there is not documentation about its API
// except for bitcoin connection which is the same way as math wallet where bitcoin object is injected
// But there is no way to identify which wallet generated the bitcoin object so we consider a
// unknown bitcoin wallet button and check only for window.bitcoin (important to work with win instead of window)
//
// ----------------------------------------------- //


var node = parent.node;
var W = parent.W;

var update = {}
var wallet = {

    // --- BUTTON OBJECT --- //
    button: {
        show: undefined,
        hide: undefined,
        showActive: undefined,
        isClicked: {
            // btc
            unknownBtc: false,
            // eth
            metamask: false,
            coinbase: false,
            xdefi: false,
            // ada
            yoroi: false,
            nami: false,
            eternl: false,
            flint: false,
            typhon: false,
            // sol
            phantom: false,
            solflare: false,
            slope: false,
            // dot
            polkadot: false,
            // cosmos
            keplr: false,
            // terra: false,
            // binance
            binance: false,
            // tron
            tronlink: false,
            // algo
            algosigner: false,
            // mina
            auro: false,
            // multi-chain
            math: false,
            coin98: false,
            clover: false,
        }
    },

    // --- ADDRESS OBJECT --- //
    address: {
        btc: {
            unknown: undefined,
        },
        eth: {
            metamask: undefined,
            coinbase: undefined,
            xdefi: undefined,
        },
        binance: {
            eth: undefined,
            binance: undefined,
            otherEVM: undefined,
        },
        ada: {
            yoroi: undefined,
            nami: undefined,
            eternl: undefined,
            flint: undefined,
            typhon: undefined,
        },
        sol: {
            phantom: undefined,
            solflare: undefined,
            slope: undefined,
        },
        dot: {
            polkadot: undefined,
            unknown: undefined,
        },
        cosmos: {
            keplr: undefined,
            // terra: undefined,
            // unknown: undefined,
        },
        tron: {
            tronlink: undefined,
        },
        algo: {
            algosigner: undefined,
        },
        mina: {
            auro: undefined,
        },
        kardia: {
            kardia: undefined,
        },
        // ic: {
        //     plug: undefined,
        // },
        math: {
            eth: undefined,
            binance: undefined,
            polygon: undefined,
            sol: undefined,
            dot: undefined,
            tron: undefined,
            cosmos: undefined,
            btc: undefined,
            fantom: undefined,
            otherEVM: undefined,
        },
        coin98: {
            eth: undefined,
            polygon: undefined,
            sol: undefined,
            binance: undefined,
            ronin: undefined,
            kardia: undefined,
            avax: undefined,
            fantom: undefined,
            celo: undefined,
            arbitrum: undefined,
            other: undefined,
        },
        clover: {
            dot: undefined,
            sol: undefined,
            eth: undefined,
            kda: undefined,
        },
    },

    // -- CHECK WALLET OBJECT -- //
    check: {
        // BITCOIN
        isBtc: false,

        // ETHEREUM
        eth: {
            isMetaMask: false,
            isCoinBase: false,
            isXdefi: false,
            isClover: false,
            multipleProviders: false,
            singleProvider: false,
        },

        // CARDANO
        ada: {
            isYoroi: false,
            isNami: false,
            isEternl: false,
            isFlint: false,
            isTyphon: false,
        },

        // SOLANA
        sol: {
            isPhantom: false,
            isSolflare: false,
            isSlope: false,
        },

        // POLKADOT
        dot: {
            isPolkadotJs: false,
            isUnknown: false,
        },

        // COSMOS
        cosmos: {
            isKeplr: false,
            // isTerra: false,
            // unknown: false,
        },

        // BINANCE CHAIN
        binance: {
            isBinanceChain: false,
        },

        // TRON
        tron: {
            isTronlink: false,
        },

        // INTERNET COMPUTER
        // ic: {
        //     isPlug: false,
        // },

        // ALGORAND
        algo: {
            isAlgosigner: false,
        },

        // MINA
        mina: {
            isAuro: false,
        },

        // KARDIACHAIN
        kardia: {
            isKardia: false,
        },

        // --- MULTI CHAIN WALLETS --- //

        // math wallet
        isMathWallet: {
            eth: false, // includes any EVM chain (polygon, binance, etc)
            btc: false,
            sol: false,
            tron: false,
            // cosmos: false,API is shit and does not work and not possible to identify it as math wallet
            dot: false,
            fantom: false,
            any: function() {
                var x = wallet.check.isMathWallet;
                return (x.eth || x.btc || x.sol || x.tron || x.cosmos || x.binance || x.dot || x.fantom)
            },
        },

        // coin98 wallet
        isCoin98: {
            eth: false,
            sol: false,
            binance: false,
            ronin: false,
            kardia: false,
            avax: false,
            fantom: false,
            any: function() {
                var x = wallet.check.isCoin98;
                return (x.eth || x.sol || x.binance || x.ronin || x.kardia || x.avax || x.fantom);
            },
        },

        // clover wallet
        isClover: {
            eth: false,
            dot: false,
            sol: false,
            kda: false,
            any: function() {
                var x = wallet.check.isClover;
                return (x.eth || x.dot || x.sol || x.kda);
            },
        }

    }

}

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



//---//
// to replace the window object in the html level with the window object
// at the parent
var win = undefined;
node.on('client-window', (msg) => {
    win = msg;
})
node.emit('html-window');
//---//



wallet.checkAll = () => {

    var detected = '';
    var notDetected = '';

    // BTC WALLET DETECTION
    //
    // not possible to identify the wallet
    //
    if(win.bitcoin) {
        wallet.check.isBtc = true;
    }



    // ETH WALLET DETECTION
    //
    // metamask, coinbase, mathWallet, coin98
    //
    if(window.ethereum) {

        // single eth wallet
        if(window.ethereum.providers === undefined) {

            wallet.check.eth.singleProvider = true;
            wallet.check.eth.multipleProviders = false;

            console.log('--------------------------------');
            console.log('----- SINGLE ETH PROVIDER ------');
            console.log('--------------------------------');

            if(window.ethereum.isMathWallet) {

                console.log('eth: math');
                wallet.check.isMathWallet.eth = true;

            } else if(window.ethereum.isCoin98) {

                console.log('eth: coin98');
                wallet.check.isCoin98.eth = true;

            } else if(window.ethereum.isCoinBaseWallet) {

                console.log('eth: coinbase');
                wallet.check.eth.isCoinBase = true;

            } else if(window.ethereum.isMetaMask) {

                console.log('eth: metamask');
                wallet.check.eth.isMetaMask = true;

            }

            // multiple eth wallets
        } else {

            wallet.check.eth.singleProvider = false;
            wallet.check.eth.multipleProviders = true;

            console.log('---------------------------------');
            console.log('- MULTIPLE ETH WALLETS DETECTED -');
            console.log('---------------------------------');

            if((window.ethereum.providers.find((provider) => provider.isMetaMask) != undefined)) {

                wallet.check.eth.isMetaMask = true;

            }

            if((window.ethereum.providers.find((provider) => provider.isCoinbaseWallet) != undefined)) {

                wallet.check.eth.isCoinBase = true;

            }

            if((window.ethereum.providers.find((provider) => provider.isClover) != undefined)) {

                wallet.check.eth.isClover = true;

            }

        }

    }

    // XDEFI ETH DETECTION
    if(win.xfi && win.xfi.ethereum) {
        wallet.check.eth.isXdefi = true;
    }

    // DOT WALLET DETECTION
    //
    // mathWallet, clover, polkadot-js
    //
    if(win.injectedWeb3 != undefined) {

        var keys = Object.keys(win.injectedWeb3);

        console.log('---');
        console.log(keys.length + ' dot wallets: ' + keys);
        console.log('---');

        wallet.check.isMathWallet.dot = keys.includes('mathwallet');
        wallet.check.isClover.dot = keys.includes('clover')
        wallet.check.dot.isPolkadotJs = keys.includes('polkadot-js');


        // not finished TODO - edge case
        var sum = (keys.indexOf('mathwallet') != -1) + (keys.indexOf('clover') != -1) + (keys.indexOf('mathwallet') != -1);
        var total = keys.length;
        var diff = total - sum;

        if(diff > 0) {
            console.log('THERE ARE ' + diff + ' MANY UNDETECTED DOT WALLETS');
            wallet.check.dot.isUnknown = true;
            console.log(sum);
            console.log(total);


            // need to spot the unknown wallet from the keys

        } else {
            console.log('all dot wallets are accounted for');
        }

    }



    // SOLANA WALLET DETECTION - 1
    //
    // mathWallet, phantom
    //
    if(win.solana != undefined) {

        if(win.solana.isMathWallet) {
            wallet.check.isMathWallet.sol = true;
        }

        if(win.solana.isPhantom && !win.solana.isMathWallet) {
            wallet.check.sol.isPhantom = true;
        }

    }

    // SOLANA WALLET DETECTION - 2
    //
    // SOLFLARE
    wallet.check.sol.isSolflare = (window.solflare && window.solflare.isSolflare);

    // SLOPE
    wallet.check.sol.isSlope = (window.Slope != undefined);



    // CARDANO WALLET DETECTION
    //
    // yoroi, nami, eternl
    //
    //
    if(win.cardano != undefined) {
        if(win.cardano.yoroi != undefined) {
            wallet.check.ada.isYoroi = true;
        }
        if(win.cardano.nami != undefined) {
            wallet.check.ada.isNami = true;
        }
        if(win.cardano.eternl != undefined) {
            wallet.check.ada.isEternl = true;
        }
        if(win.cardano.flint != undefined) {
            wallet.check.ada.isFlint = true;
        }
        if(win.cardano.typhon != undefined) {
            wallet.check.ada.isTyphon = true;
        }
    }



    // CLOVER WALLET DETECTION
    //
    // eth, sol, kda
    //
    // dot detection is already done above
    //
    // eth detection for multiple providers is done under check.eth.isClover
    if(win.clover != undefined) {
        wallet.check.isClover.eth = true;
    }

    if(win.clover_solana != undefined) {
        wallet.check.isClover.sol = true;
    }

    if(win.clover_kadena != undefined) {
        wallet.check.isClover.kda = true;
    }

    // MATH WALLET DETECTION
    //
    // solana, polkadot, tron, bitcoin and eth already being accounted for
    //
    // fantom network is accounted in eth network
    //
    // nothing else left to check for math wallet?
    // -harmony chain gives an error, doubt anyone uses it - so ignored
    //



    // COIN98 WALLET DETECTIONS
    //
    // solana
    //
    // note: we are checking for eth wallet on the eth section above
    //
    // fantom: same as eth
    // harmony: same as eth
    // ronin: same as eth
    // terra/cosmos: existence of window.coin98 only
    // avalanche: same as eth
    //
    if(window.coin98 != undefined) {

        // kardiachain
        if(win.kardiachain != undefined) {
            if(win.kardiachain.isCoin98) {
                wallet.check.isCoin98.kardia = true;
            }
        }

        // solana
        window.coin98.sol.request({ method: 'has_wallet', params: ['solana'] }).then(() => {
            wallet.check.isCoin98.sol = true;
            console.log('coin98 sol wallet exists');
            wallet.report();
            wallet.button.showActive();
        }).catch(e => {
            wallet.check.isCoin98.sol = false;
            console.log('coin98 sol wallet does not exist');
        })

    }



    // BINANCE WALLET CHECK -> not sure if this is the only case
    if(window.BinanceChain != undefined) {
        if(!window.BinanceChain.isCoin98) {
            wallet.check.binance.isBinanceChain = true;
        } else {
            wallet.check.isCoin98.binance = true;
        }
    }



    // COSMOS - KEPLR WALLET DETECTION
    wallet.check.cosmos.isKeplr = (window.keplr != undefined);



    // TRON
    // math wallet
    if(win.tronWeb != undefined) {
        wallet.check.isMathWallet.tron = (win.tronWeb.isMathWallet != undefined) ? tronWeb.isMathWallet : false;
    }
    if(win.tronLink != undefined) {
        wallet.check.tron.isTronlink = true;
    }

    // KARDIACHAIN
    // if coin98 is not active / conflicting
    if(win.kardiachain != undefined) {
        if(!win.kardiachain.isCoin98) {
            if(win.kardiachain.isKaiWallet) {
                wallet.check.kardia.isKardia = true;
            }
        }
    }

    // INTERNET COMPUTER
    // if(win.ic && win.ic.plug) {
    //     wallet.check.ic.isPlug = true;
    // }

    // ALGORAND
    if(win.AlgoSigner != undefined) {
        wallet.check.algo.isAlgosigner = true;
    }

    // MINA
    if(win.mina != undefined) {
        wallet.check.mina.isAuro = true;
    }

}

wallet.report = () => {

    var detected = '';
    var undetected = '';

    var check = wallet.check;

    if(check.isBtc) {
        detected += '<br> btc - Unknown Wallet';
    } else {
        undetected += '<br> btc - Unknown Wallet';
    }

    if(check.binance.isBinanceChain) {
        detected += '<br> bsc/eth - Binance Wallet';
    } else {
        undetected += '<br> bsc/eth - Binance Wallet';
    }

    if(check.eth.isMetaMask) {
        detected += '<br> eth - Metamask';
    } else {
        undetected += '<br> eth - Metamask';
    }

    if(check.eth.isXdefi) {
        detected += '<br> eth - XDefi';
    } else {
        undetected += '<br> eth - XDefi';
    }

    // dot

    if(check.eth.isCoinBase) {
        detected += '<br> eth - Coinbase';
    } else {
        undetected += '<br> eth - Coinbase';
    }

    if(check.dot.isPolkadotJs) {
        detected += '<br> dot - Polkadot-js';
    } else {
        undetected += '<br> dot - Polkadot-js';
    }

    // ada

    if(check.ada.isYoroi) {
        detected += '<br> ada - Yoroi';
    } else {
        undetected += '<br> ada - Yoroi';
    }

    if(check.ada.isNami) {
        detected += '<br> ada - Nami';
    } else {
        undetected += '<br> ada - Nami';
    }

    if(check.ada.isEternl) {
        detected += '<br> ada - Eternl';
    } else {
        undetected += '<br> ada - Eternl';
    }

    if(check.ada.isFlint) {
        detected += '<br> ada - Flint';
    } else {
        undetected += '<br> ada - Flint';
    }

    if(check.ada.isTyphon) {
        detected += '<br> ada - Typhon';
    } else {
        undetected += '<br> ada - Typhon';
    }

    // solana

    if(check.sol.isPhantom) {
        detected += '<br> sol - Phantom';
    } else {
        undetected += '<br> sol - Phantom';
    }

    if(check.sol.isSolflare) {
        detected += '<br> sol - Solflare';
    } else {
        undetected += '<br> sol - Solflare';
    }

    if(check.sol.isSlope) {
        detected += '<br> sol - Slope';
    } else {
        undetected += '<br> sol - Slope';
    }

    // cosmos

    if(check.cosmos.isKeplr) {
        detected += '<br> cosmos - Keplr';
    } else {
        undetected += '<br> cosmos - Keplr';
    }

    // if(check.cosmos.isTerra) {
    //     detected += '<br> terra - Terra Station';
    // } else {
    //     undetected += '<br> terra - Terra Station';
    // }

    // tron

    if(check.tron.isTronlink) {
        detected += '<br> tron - Tronlink';
    } else {
        undetected += '<br> tron - Tronlink';
    }

    // algorand

    if(check.algo.isAlgosigner) {
        detected += '<br> algo - Algosigner';
    } else {
        undetected += '<br> algo - Algosigner';
    }

    // mina

    if(check.mina.isAuro) {
        detected += '<br> mina - Auro';
    } else {
        undetected += '<br> mina - Auro';
    }

    // kardia

    if(check.kardia.isKardia) {
        detected += '<br> kardia - Kai Wallet';
    } else {
        undetected += '<br> kardia - Kai Wallet';
    }

    // multi

    if(check.isClover.any()) {
        detected += '<br> dot/eth/kda/sol - Clover';
    } else {
        undetected += '<br> dot/eth/kda/sol - Clover ';
    }

    if(check.isMathWallet.any()) {
        detected += '<br> eth/atom/avax/tron/fantom/bsc/sol/dot/btc - Math';
    } else {
        undetected += '<br> eth/atom/avax/tron/fantom/bsc/sol/dot/btc - Math';
    }

    if(check.isCoin98.any()) {
        detected += '<br> eth/atom/kardia/avax/fantom/sol - Coin98';
    } else {
        undetected += '<br> eth/atom/kardia/avax/fantom/sol - Coin98';
    }



    $('#text-detected').html(detected);
    $('#text-undetected').html(undetected);



}


wallet.button.hide = (id) => {
    $(('.button-' + id)).css({'display':'none'});
}
wallet.button.show = (id) => {
    $(('.button-' + id)).css({'display':''});
}

wallet.button.showActive = () => {

    var check = wallet.check;
    var button = wallet.button;

    // --- BITCOIN --- //

    if(!check.isBtc) {
        button.hide('btc');
    } else {
        button.show('btc');
    }

    // --- ETHEREUM --- //

    if(!check.eth.isMetaMask) {
        button.hide('mm');
    } else {
        button.show('mm')
    }

    if(!check.eth.isCoinBase) {
        button.hide('cb');
    } else {
        button.show('cb')
    }

    if(!check.eth.isXdefi) {
        button.hide('xdf');
    } else {
        button.show('xdf')
    }

    // --- BINANCE --- //

    if(!check.binance.isBinanceChain) {
        button.hide('bc');
    } else {
        button.show('bc')
    }

    // --- SOLANA --- //

    if(!check.sol.isPhantom) {
        button.hide('ph');
    } else {
        button.show('ph')
    }

    if(!check.sol.isSolflare) {
        button.hide('sf');
    } else {
        button.show('sf')
    }

    if(!check.sol.isSlope) {
        button.hide('slp');
    } else {
        button.show('slp')
    }

    // --- COSMOS --- //

    if(!check.cosmos.isKeplr) {
        button.hide('kp');
    } else {
        button.show('kp')
    }

    if(!check.cosmos.unknown) {
        button.hide('cosmos');
    } else {
        button.show('cosmos')
    }

    // --- POLKADOT --- //

    if(!check.dot.isPolkadotJs) {
        button.hide('dot');
    } else {
        button.show('dot')
    }

    // --- TRON --- //

    if(!check.tron.isTronlink) {
        button.hide('tron');
    } else {
        button.show('tron')
    }

    // --- ALGORAND --- //

    if(!check.algo.isAlgosigner) {
        button.hide('algo');
    } else {
        button.show('algo')
    }

    // --- MINA --- //

    if(!check.mina.isAuro) {
        button.hide('mina');
    } else {
        button.show('mina');
    }

    // --- KARDIA --- //

    if(!check.kardia.isKardia) {
        button.hide('kardia');
    } else {
        button.show('kardia');
    }

    // --- CARDANO --- //

    if(!check.ada.isYoroi) {
        button.hide('yo');
    } else {
        button.show('yo')
    }

    if(!check.ada.isNami) {
        button.hide('na');
    } else {
        button.show('na')
    }

    if(!check.ada.isEternl) {
        button.hide('et');
    } else {
        button.show('et')
    }

    if(!check.ada.isFlint) {
        button.hide('flint');
    } else {
        button.show('flint')
    }

    if(!check.ada.isTyphon) {
        button.hide('ty');
    } else {
        button.show('ty')
    }

    // --- MULTI CHAIN --- //

    if(!check.isMathWallet.any()) {
        button.hide('mw');
    } else {
        button.show('mw')
    }

    if(!check.isCoin98.any()) {
        button.hide('c98');
    } else {
        button.show('c98')
    }

    if(!check.isClover.any()) {
        button.hide('cl');
    } else {
        button.show('cl')
    }

}




$('#main-connect').click(function() {

    $('.column-1').css({'display':'flex'});
    $('#main-connect').css({'display':'none'});

    wallet.checkAll();
    wallet.report();

    wallet.button.showActive();

})





// AGNOSTIC BITCOIN WALLET
$('#button-btc').click(async function() {

    // math wallet way
    if(win.bitcoin.getAccount != undefined) {
        await win.bitcoin.getAccount()
        .then(res => {
            wallet.address.btc.unknown = res.address
        })
    }

    // liquality way
    if(win.bitcoin.enable != undefined) {
        await win.bitcoin.enable()
        .then(res => {
            wallet.address.btc.unknown = res[0].address
        })
    }

    update.text(wallet.address.btc.unknown, 'btc')

})



// --- ETHEREUM --- //

// METAMASK
$('#button-mm').click(async function() {

    var metaMaskProvider;

    if(wallet.check.eth.multipleProviders) {
        metaMaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }

    if(wallet.check.eth.singleProvider) {
        metaMaskProvider = window.ethereum;
    }

    console.log('metamask provider');
    console.log(metaMaskProvider);
    try {

        await metaMaskProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            wallet.address.eth.metamask = [];
            accounts.forEach(i => wallet.address.eth.metamask.push(i))
            update.text(wallet.address.eth.metamask, 'mm');

        })

    } catch(e) {
        console.log('Metamask error: ' + e);
    }

})

// COINBASE
$('#button-cb').click(async function() {

    var coinBaseProvider;

    if(wallet.check.eth.multipleProviders) {
        coinBaseProvider = window.ethereum.providers.find((provider) => provider.isCoinbaseWallet);
    }

    if(wallet.check.eth.singleProvider) {
        coinBaseProvider = window.ethereum.provider;
    }

    console.log('coinbase provider');
    console.log(coinBaseProvider);
    try {

        await coinBaseProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            wallet.address.eth.coinbase = [];
            accounts.forEach(i => wallet.address.eth.coinbase.push(i))
            update.text(wallet.address.eth.coinbase, 'cb');

        })

    } catch(e) {
        console.log('Coinbase error: ' + e);
    }

})

// XDEFI
$('#button-xdf').click(async function() {

    try {

        await win.xfi.ethereum
        .request({
            method: 'eth_requestAccounts'
        })
        .then((accounts) => {
            wallet.address.eth.xdefi = accounts[0];
            update.text(wallet.address.eth.xdefi, 'xdf');
        })

    } catch (e) {
        console.log('xdefi wallet error: ' + e);
    }

})



// --- SOLANA --- //

// SOLFLARE - CHECK IF THE ADDRESS IS IN AN ARRAY OR JUST A STRING
$('#button-sf').click(async function() {

    try {

        await window.solflare.connect()
        .then((res)=>{
            wallet.address.sol.solflare = window.solflare.publicKey.toString();
            update.text(wallet.address.sol.solflare, 'sf');
        })

    } catch (e) {
        console.log('Solflare error: ' + e);
    }

})

// PHANTOM
$('#button-ph').click(async function() {

    try {

        await win.solana.connect()
        .then((res)=>{

            wallet.address.sol.phantom = win.solana.publicKey.toString()
            update.text(wallet.address.sol.phantom, 'ph');

        })

    } catch (e) {
        console.log('Phantom error: ' + e);
    }


})

// SLOPE
var slopeSwitch = true;
$('#button-slp').click(async function() {

    node.on('client-slope', function(address) {

        wallet.address.sol.slope = address;
        update.text(address, 'slp');

    })

    if(slopeSwitch) {
        slopeSwitch = false;
        node.emit('html-slope');
    }

})



// --- COSMOS --- //

// KEPLR
$('#button-kp').click(async function() {

    try {

        var chainId = "cosmoshub-4";

        await window.keplr.enable(chainId);

        var offlineSigner = window.keplr.getOfflineSigner(chainId);

        await offlineSigner
        .getAccounts()
        .then((accounts)=>{
            console.log(accounts);
            wallet.address.cosmos.keplr = accounts.map(i => i.address)
            console.log(accounts[0].address);
            console.log(wallet.address.cosmos.keplr);
            update.text(wallet.address.cosmos.keplr, 'kp');
        });

    } catch (e) {
        console.log('Keplr error: ' + e);
    }

})



// --- CARDANO --- //

var multiplAddressConverter = (arr) => {

    var string = '';
    for(var i = 0; i < arr.length; i++) {

        string += arr[i] + '<br>';

    }

    return string;

}

// YOROI
$('#button-yo').click(async function() {

    var myAdaApi, unused, used, all;


    try {
        await win.cardano.yoroi.enable()
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
            wallet.address.ada.yoroi = all;
            update.text(multiplAddressConverter(all), 'yo')
            console.log(multiplAddressConverter(all));

        })
    } catch (e) {
        console.log('yoroi wallet error: ' + e);
    }

})

// NAMI
$('#button-na').click(async function() {

    var myAdaApi, unused, used, all;

    try {
        await win.cardano.nami.enable()
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
            wallet.address.ada.nami = all;
            update.text(multiplAddressConverter(all), 'na')
            console.log(multiplAddressConverter(all));

        })
    } catch (e) {
        console.log('nami wallet error: ' + e);
    }

})

// ETERNL
$('#button-et').click(async function() {

    var myAdaApi, unused, used, all;

    try {
        await win.cardano.eternl.enable()
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
            wallet.address.ada.eternl = all;
            update.text(multiplAddressConverter(all), 'et')
            console.log(multiplAddressConverter(all));

        })
    } catch (e) {
        console.log('eternl wallet error: ' + e);
    }

})

// FLINT
$('#button-flint').click(async function() {

    var myAdaApi, unused, used, all;

    try {
        await win.cardano.flint.enable()
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
            wallet.address.ada.flint = all;
            update.text(multiplAddressConverter(all), 'flint')
            console.log(multiplAddressConverter(all));

        })
    } catch (e) {
        console.log('flint wallet error: ' + e);
    }

})

// TYPHON
$('#button-ty').click(async function() {

    try {
        var address = wallet.address.ada.typhon

        await win.cardano.typhon.enable()
        .then(() => {
            return win.cardano.typhon.getAddress();
        })
        .then((msg) => {

            address = msg.data;
            update.text(address, 'ty')

        })
    } catch (e) {
        console.log('typhon wallet erro: ' + e);
    }

})



// --- POLKADOT --- //

// DOT-JS
$('#button-dot').click(async function() {

    var dot = win.injectedWeb3['polkadot-js'];

    dot.enable()
    .then((res)=>{
        return res.accounts.get()
    })
    .then((res)=>{
        wallet.address.dot.polkadot = res[0].address;
        update.text(res[0].address, 'dot')
    })

})



// ---- TRON --- //

// TRONLINK
$('#button-tron').click(async function() {

    try {

        var address = wallet.address.tron;

        win.tronLink.request({
            method:'tron_requestAccounts'
        })
        .then(()=>{
            address.tronlink = win.tronWeb.defaultAddress.base58;
            update.text(address.tronlink, 'tron')
        })


    } catch (e) {
        console.log('Tronlink wallet error: ' + e);
    }

})



// --- ALGORAND --- //
$('#button-algo').click(async function() {

    try {
        await win.AlgoSigner.connect().then(()=>{
            return win.AlgoSigner.accounts({ledger:'MainNet'});
        }).then((res)=>{
            wallet.address.algo.algosigner = res[0].address;
            update.text(res[0].address, 'algo');
        })
    } catch (e) {
        console.log('algosigner wallet error: ' + e);
    }

})



// --- MINA --- //
$('#button-mina').click(async function() {

    try {
        window.mina.requestAccounts().then((accounts) => {
            wallet.address.mina.auro = accounts[0];
            update.text(accounts[0], 'mina');
        })
    } catch (e) {
        console.log('auro wallet error: ' + e);
    }

})



// --- KARDIA CHAIN --- //
$('#button-kardia').click(async function() {

    try {
        win.kardiachain.enable().then((accounts) => {
            wallet.address.kardia.kardia = accounts[0];
            update.text(accounts[0], 'kardia');
        })
    } catch (e) {
        console.log('kardia wallet error: ' + e);
    }

})


// --- MULTI CHAIN --- //

// CLOVER WALLET
$('#button-cl').click(async function() {

    var isClover = wallet.check.isClover;
    var address = wallet.address.clover;

    // ETHEREUM
    if(isClover.eth) {

        if(wallet.check.eth.multipleProviders) {
            cloverProvider = window.ethereum.providers.find((provider) => provider.isClover);
        }

        if(wallet.check.eth.singleProvider) {
            cloverProvider = window.ethereum;
        }

        try {

            await cloverProvider
            .request({
                method: 'eth_requestAccounts',
            })
            .then((accounts) => {
                someAddress = accounts[0]
                update.text(someAddress, 'cl-1');
            })

            await cloverProvider
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                someChain = myChainId;

                if(someChain === '0x1') {
                    chainName = 'Ethereum';
                    address.eth = someAddress;
                } else if(someChain === '0x38') {
                    chainName = 'Binance';
                    address.binance = someAddress;
                } else if(someChain === '0x89') {
                    chainName = 'Polygon';
                    address.polygon = someAddress;
                } else if(someChain === '0xfa') {
                    chainName = 'Fantom';
                    address.fantom = someAddress;
                } else {
                    chainName = someChain;
                    address.otherEVM = someAddress;
                }

                update.text(chainName, 'cl-2');

            })

        } catch (e) {
            console.log('clover wallet - eth - error: ' + e);
        }

    }

    // POLKADOT
    if(isClover.dot) {
        try {

            win.injectedWeb3.clover
            .enable()
            .then((res) => {
                someProvider = res.accounts.get();
                return someProvider;
            })
            .then((res) => {

                someAddress = res[0].address;
                address.dot = someAddress;
                update.text(address.dot, 'cl-3')
                update.text('Polkadot', 'cl-4')

            })

        } catch (e) {
            console.log('Clover wallet polkadot error: ' + e);
        }
    }

    // SOLANA
    if(isClover.sol) {

        try {
            await window.clover_solana
            .getAccount()
            .then((account)=>{
                address.sol = account;
                console.log('clover sol address');
                console.log(account);
                update.text(account, 'cl-5');
                update.text('Solana', 'cl-6')

            })
        } catch (e) {
            console.log('Clover wallet solana error: ' + e);
        }

    }

    // KADENA
    if(isClover.kda) {
        try {
            await win.clover_kadena
            .getAccount()
            .then((account)=>{
                address.kda = account;
                console.log('clover kda address');
                console.log(account);
                update.text(account, 'cl-7');
                update.text('Kadena', 'cl-8')

            })
        } catch (e) {
            console.log('Clover wallet kadena error: ' + e);
        }
    }

})

// BINANCE WALLET - multi EVM chain wallet
$('#button-bc').click(async function() {

    var address = wallet.address.binance;
    var someChain, someAddress;

    try {

        await window.BinanceChain
        .request({
            method: 'eth_requestAccounts',
        })
        .then((accounts) => {

            someAddress = accounts;
            update.text(someAddress, 'bc1')

        })

        // chain may different between binance and eth thus checked for
        await window.BinanceChain
        .request({
            method: 'eth_chainId',
        })
        .then((myChainId) => {

            someChain = myChainId;

            if(someChain === '0x1') {
                chainName = 'Ethereum';
                address.eth = someAddress;
            } else if(someChain === '0x38') {
                chainName = 'Binance';
                address.binance = someAddress;
            } else {
                chainName = someChain;
                address.otherEVM = someAddress;
            }

            update.text(chainName, 'bc2');

        })

    } catch (e) {

        console.log('Binance wallet error: ' + e);

    }


})

// MATH WALLET
$('#button-mw').click(async function() {

    var isMath = wallet.check.isMathWallet;
    var address = wallet.address.math;

    var someAddress = undefined;

    // for EVM chains other than eth (polygon, binance)
    var someProvider = undefined;
    var someChain = undefined;
    var chainName = undefined;

    // ETHEREUM (eth, binance, polygon)
    if(isMath.eth) {

        try {

            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
            })
            .then((accounts) => {
                someAddress = accounts[0]
                update.text(someAddress, 'mw1');
            })

            await window.ethereum
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                someChain = myChainId;

                if(someChain === '0x1') {
                    chainName = 'Ethereum';
                    address.eth = someAddress;
                } else if(someChain === '0x38') {
                    chainName = 'Binance';
                    address.binance = someAddress;
                } else if(someChain === '0x89') {
                    chainName = 'Polygon';
                    address.polygon = someAddress;
                } else if(someChain === '0xfa') {
                    chainName = 'Fantom';
                    address.fantom = someAddress;
                } else {
                    chainName = someChain;
                    address.otherEVM = someAddress;
                }

                update.text(chainName, 'mw2');

            })

        } catch (e) {

            console.log('Math wallet EVM error: ' + e);

        }

    }

    // SOLANA
    if(isMath.sol) {

        try {
            await window.solana
            .getAccount()
            .then((account)=>{
                address.sol = account;
                update.text(address.sol, 'mw1');
                update.text('Solana', 'mw2')

            })
        } catch (e) {
            console.log('Math wallet solana error: ' + e);
        }

    }

    // POLKADOT
    if(isMath.dot) {

        try {

            win.injectedWeb3.mathwallet
            .enable()
            .then((res) => {
                someProvider = res.accounts.get();
                return someProvider;
            })
            .then((res) => {

                someAddress = res[0].address;
                address.dot = someAddress;
                update.text(address.dot, 'mw1')
                update.text('Polkadot', 'mw2')

            })

        } catch (e) {
            console.log('Math wallet polkadot error: ' + e);
        }

    }

    // TRON
    if(isMath.tron) {

        try {

            address.tron = tronWeb.defaultAddress.base58;
            update.text(address.tron, 'mw1')
            update.text('Tron', 'mw2')

        } catch (e) {
            console.log('Math wallet tron error: ' + e);
        }

    }

    // COSMOS -> shitty api we ignore...

    // FANTOM -> eth method covers it

    // BTC -> accounted for by a differetn bitcoin specific button


})

// COIN98 WALLET - really hard too many things to cover
//
// once you connect you can get all the address for different networks I think?
//
$('#button-c98').click(async function() {

    var address = wallet.address.coin98;
    var chainName;

    try {
        console.log('coin98 button clicked');

        // this returns the main EVM chain on the wallet
        if(wallet.check.isCoin98.eth) {

            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
            })
            .then((accounts) => {

                console.log(accounts[0]);
                update.text(accounts[0], 'c981')

                var chainName = window.ethereum.chain;

                if(chainName === 'fantom') {
                    address.fantom = accounts[0];
                    chainName = 'Fantom';
                } else if(chainName === 'ether') {
                    address.eth = accounts[0];
                    chainName = 'Ethereum';
                } else if(chainName === 'binanceSmart') {
                    address.binance = accounts[0];
                    chainName = 'Binance';
                } else if(chainName === 'avax') {
                    address.avax = accounts[0];
                    chainName = 'Avalanche';
                } else if(chainName === 'matic') {
                    address.polygon = accounts[0];
                    chainName = 'Polygon';
                } else if(chainName === 'kardia') {
                    address.kardia = accounts[0];
                    chainName = 'Kardia';
                } else if(chainName === 'ronin') {
                    address.ronin = accounts[0];
                    chainName = 'Ronin';
                } else if(chainName === 'celo') {
                    address.celo = accounts[0];
                    chainName = 'Celo';
                } else if(chainName === 'arbitrum') {
                    address.arbitrum = accounts[0];
                    chainName = 'Arbitrum';
                } else {
                    address.other = {account: accounts[0], name: chainName};
                }

                update.text(accounts[0], 'c98-1');
                update.text(chainName, 'c98-2');

            })

        }

        console.log('eth to sol');
        // once connected you can get the solana chain too
        // just check that the account that is returned is not empty
        if(wallet.check.isCoin98.sol) {

            await window.coin98.sol
            .request({
                method: 'sol_accounts'
            })
            .then((accounts) => {
                console.log('solana');
                console.log(accounts);
                if(accounts.length === 0) {

                } else {
                    update.text(accounts, 'c98-3');
                    update.text('Solana', 'c98-4');
                }

            })

        }

        if(wallet.check.isCoin98.kardia) {

            await win.kardiachain.enable().then((accounts) => {
                wallet.address.coin98.kardia = accounts[0];
                update.text(accounts[0], 'c98-9');
                update.text('Kardia', 'c98-10');
            })

        }

        console.log('sol to cosmos');

        // to get the cosmos chain again check if it is not empty
        var cosmos = window.coin98.cosmos('cosmos');

        await cosmos.request({
            method: 'cosmos_accounts'
        })
        .then((accounts) => {
            console.log('cosmos');
            console.log(accounts);
            if(accounts.length === 0) {

            } else {
                update.text(accounts, 'c98-5');
                update.text('Cosmos', 'c98-6');
            }

        })

        console.log('cosmos to terra');

        var terra = window.coin98.cosmos('terra');

        // await terra.request({
        //     method: 'cosmos_accounts'
        // })
        // .then((accounts)) => {
        //     console.log('terra');
        //     console.log(accounts);
        // }

        await terra.request({
            method: 'cosmos_accounts'
        })
        .then((accounts) => {
            console.log('terra');
            console.log(accounts);
            if(accounts.length === 0) {

            } else {
                update.text(accounts, 'c98-7');
                update.text('Terra', 'c98-8');
            }

        })
    } catch (e) {
        console.log('coin98 wallet error: ' + e);
    }



})



// ---- MOBILE / DESKTOP ---- //

// WALLET CONNECT

var wc = {
    hide: {},
    reformat: {},
    generate: {
        browserButton: {},
    },
}

$('#button-wc').click(async function() {

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
                "trust",
                "rainbow",
                "metamask",
                "argent",
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

            update.text(address, 'wc1');
            wc.web3 = new Web3(wc.provider);
            console.log('wc.web3');
            console.log(wc.web3);
            // console.log(wc.web3.givenProvider.chainId);
            // console.log(wc.web3.eth.getChainId().then((myPro)=>{console.log(myPro);}));
            wc.web3.eth.getChainId()
            .then((res)=>{
                console.log(res);
                update.text(res, 'wc2')
            })

        })
        .then(()=> {
            wc.provider.disconnect();
        })

    } catch (switchError) {
        console.log('Wallet Connect error');
        console.log(switchError.code);
        console.log(switchError);
        // wc.provider.disconnect();
    }


})


// ---- MOBILE WALLET CONNECTION FOR DESKTOPS ---- //

wc.hide.app = () => {

    console.log('hiding the wallet connect window manually');

    $('#walletconnect-wrapper').css({'display':'none'});
    setTimeout(()=>{
        $('#walletconnect-wrapper').css({'display':'none'});
        setTimeout(()=>{
            $('#walletconnect-wrapper').css({'display':'none'});
            setTimeout(()=>{
                $('#walletconnect-wrapper').css({'display':'none'});
                setTimeout(()=>{
                    $('#walletconnect-wrapper').css({'display':'none'});
                    setTimeout(()=>{
                        $('#walletconnect-wrapper').css({'display':'none'});

                    }, 100)
                }, 100)
            }, 100)
        }, 100)
    }, 100)
}

wc.reformat.onlyQR = () => {

    setTimeout(()=>{
        wc.reformat.onlyQRHelper();
        setTimeout(()=>{
            wc.reformat.onlyQRHelper();
            setTimeout(()=>{
                wc.reformat.onlyQRHelper();
                setTimeout(()=>{
                    wc.reformat.onlyQRHelper();
                    setTimeout(()=>{
                        wc.reformat.onlyQRHelper();
                        setTimeout(()=>{
                            wc.reformat.onlyQRHelper();
                            setTimeout(()=>{
                                wc.reformat.onlyQRHelper();
                                setTimeout(()=>{
                                    wc.reformat.onlyQRHelper();
                                    setTimeout(()=>{
                                        wc.reformat.onlyQRHelper();
                                        setTimeout(()=>{
                                            wc.reformat.onlyQRHelper();
                                        }, 100)
                                    }, 100)
                                }, 100)
                            }, 100)
                        }, 100)
                    }, 100)
                }, 100)
            }, 100)
        }, 100)
    }, 100)

}

wc.reformat.onlyQRHelper = () => {

    $('.walletconnect-modal__mobile__toggle').css({'display':'none'});
    $('#walletconnect-qrcode-text').css({'opacity':'0'});

    $('.walletconnect-modal__close__wrapper').css({
        'filter':'invert(1)',
        'width':'40px',
        'height':'40px',
        'margin-top':'25px',
        'margin-right':'18px',
        'padding':'13px'
    })
    $('.walletconnect-modal__header').css({
        'position':'static'
    })

}

// RAINBOW
$('#button-wc-rainbow').click(async function() {

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
                "trust",
                "rainbow",
                "metamask",
                "argent",
                "imtoken",
                "pillar",
                "coinomi"
                "coin98",
            ],
        },
    });


    console.log('inside wc.connect');

    try {

        wc.reformat.onlyQR();

        await wc.provider
        .enable()
        .then((address)=>{
            update.text(address, 'wc-rainbow-1');
            wc.web3 = new Web3(wc.provider);
            wc.web3.eth.getChainId()
            .then((res)=>{

                if(res === 1) {
                    chainName = 'Ethereum';
                    address.eth = someAddress;
                } else if(res === 56) {
                    chainName = 'Binance';
                    address.binance = someAddress;
                } else if(res === 137) {
                    chainName = 'Polygon';
                    address.polygon = someAddress;
                } else if(res === '0xfa') {
                    chainName = 'Fantom';
                    address.fantom = someAddress;
                } else {
                    chainName = res;
                    address.otherEVM = someAddress;
                }
                console.log(res);
                update.text(res, 'wc-rainbow-2')
            })
        })
        .then(()=> {
            wc.provider.disconnect();
        })

    } catch (switchError) {
        console.log('rainbow wallet Connect error');
        console.log(switchError.code);
        console.log(switchError);
    }

})

wc.buttonList = [
    'rainbow', //checked
    'argent', //checked
    'trust', //checked
    'metamask', //checked
    'mathWallet', //app did not work
    // 'crypto', //does not react to the qr code
    'ledger',
    'coin98', //checked
    'coinomi', //checked
]

wc.generate.browserButton.qrOnly = (string) => {

    var buttonDivString = '#button-wc-' + string;

    $(buttonDivString).click(async function() {

        console.log(string + ' button');

        wc.provider = new WalletConnectProvider.default({
            rpc: {
                1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
                25: "https://evm-cronos.crypto.org"
                56: "https://bsc-dataseed.binance.org/",
                59: 'https://api.eosargentina.io'
                137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
                43114: "https://api.avax.network/ext/bc/C/rpc",
                1666600000: "https://api.harmony.one",
            },
            bridge: 'https://bridge.walletconnect.org',
            qrcodeModalOptions: {
                mobileLinks: [
                    "trust",
                    "rainbow",
                    "metamask",
                    "argent",
                    "imtoken",
                    "pillar",
                    "coinomi"
                    "coin98",
                ],
            },
        });

        try {

            wc.reformat.onlyQR();

            await wc.provider
            .enable()
            .then((address)=>{
                update.text(address, ('wc-' + string + '-1'));
                wc.web3 = new Web3(wc.provider);
                wc.web3.eth.getChainId()
                .then((res)=>{
                    console.log(res);
                    console.log(typeof res);
                    if(res === 1) {
                        chainName = 'Ethereum';
                        // address.eth = someAddress;
                    } else if(res === 56) {
                        chainName = 'Binance';
                        // address.binance = someAddress;
                    } else if(res === 137) {
                        chainName = 'Polygon';
                        // address.polygon = someAddress;
                    } else if(res === 43114) {
                        chainName = 'Avalanche';
                        // address.polygon = someAddress;
                    } else if(res === 1666600000) {
                        chainName = 'Harmony';
                        // address.polygon = someAddress;
                    } else if(res === 250) {// not correct
                        chainName = 'Fantom';
                        // address.fantom = someAddress;
                    } else if(res === 42220) {// not correct
                        chainName = 'Celo';
                        // address.fantom = someAddress;
                    } else {
                        console.log('res not identified: ' + res);
                        console.log(typeof res);
                        chainName = res;
                        // address.otherEVM = someAddress;
                    }
                    console.log(res);
                    update.text(chainName, ('wc-' + string + '-2'))
                })
            })
            .then(()=> {
                wc.provider.disconnect();
                wc.hide.app();
            })

        } catch (switchError) {
            console.log(string + ' wallet Connect error');
            console.log(switchError.code);
            console.log(switchError);
            wc.hide.app();
        }

    })

}

wc.buttonList.forEach(wc.generate.browserButton.qrOnly);

wc.generate.browserButton.qrAndDesktop = (string) => {

    var buttonDivString = '#button-wc-' + string;

    $(buttonDivString).click(async function() {

        console.log(string + ' button');

        wc.provider = new WalletConnectProvider.default({
            rpc: {
                1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
                25: "https://evm-cronos.crypto.org"
                56: "https://bsc-dataseed.binance.org/",
                59: 'https://api.eosargentina.io'
                137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
                43114: "https://api.avax.network/ext/bc/C/rpc",
                1666600000: "https://api.harmony.one",
            },
            bridge: 'https://bridge.walletconnect.org',
        });

        try {

            // wc.reformat.onlyQR();

            await wc.provider
            .enable()
            .then((address)=>{
                update.text(address, ('wc-' + string + '-1'));
                wc.web3 = new Web3(wc.provider);
                wc.web3.eth.getChainId()
                .then((res)=>{

                    if(res === 1) {
                        chainName = 'Ethereum';
                        address.eth = someAddress;
                    } else if(res === 56) {
                        chainName = 'Binance';
                        address.binance = someAddress;
                    } else if(res === 137) {
                        chainName = 'Polygon';
                        address.polygon = someAddress;
                    } else if(res === '0xfa') {
                        chainName = 'Fantom';
                        address.fantom = someAddress;
                    } else {
                        chainName = res;
                        address.otherEVM = someAddress;
                    }
                    console.log(res);
                    update.text(res, ('wc-' + string + '-2'))
                })
            })
            .then(()=> {
                wc.provider.disconnect();
            })

        } catch (switchError) {
            console.log(string + ' wallet Connect error');
            console.log(switchError.code);
            console.log(switchError);
        }

    })

}
wc.generate.browserButton.qrAndDesktop('desktop');



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
