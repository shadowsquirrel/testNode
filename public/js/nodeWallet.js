var node = parent.node;

var wallet = {

    connect: {
        mobile: {
            fromDesktop: undefined,
            fromMobile: undefined,
        }
    },
    detectWallets: undefined,
    registerDetectionResults: undefined,
    createDiv: {
        button: undefined,
        walletIcon: undefined,
        walletText: undefined,
    },
    button: {
        inject: undefined,
        activate: undefined,
        mobile: {
            // mobile buttons are already predefined in html so no inject method
            activate: undefined,
        },
        show: {
            success: undefined,
            failure: undefined,
        },
        // auxiliary functions used in button.show.*
        texify: undefined,
        buttonify: undefined
    },
    activate: {},
    list: {
        undetected: new Set(),  // [<string>, ...]
        detected: new Set(), // [<string>, ...]
        connected: new Set(), // [{type:<string>, name:<string>, chain:<string>, address:<string>}, ...]
        // for mobile buttons we use a predefined list
        mobile: [
            'metamask',
            'argent',
            'rainbow',
            'trust',
            'coinomi',
            'coin98',
            'other'
        ],
    },
    change: {
        buttonText: undefined,
    },
    mobile: {
        showListContainer: undefined,
        hideListContainer: undefined,
        showQrCode: undefined,
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
        },

        // BINANCE CHAIN
        binance: {
            isBinanceChain: false,
        },

        // TRON
        tron: {
            isTronlink: false,
        },

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

    },

    help: {
        capitalizeFirstLetter: (string) => {

            if(string != '') {
                return string.charAt(0).toUpperCase() + string.slice(1);
            } else {
                return string;
            }

        },
        // TO DO: need to defined the type for other cases
        getButtonFromString: (string, type) => {

            var button;

            if(type === 'desktop-mobile') {
                button = document.getElementById('wallet-mobile-button-' + string);
            }

            if(type === 'extension') {
                button = document.getElementById('wallet-button-' + string);
            }

            return button;

        },
        // for debug purposes
        fakeResponse: (walletName) => {

            var button = document.getElementById('wallet-button-' + walletName);
            var rnd = Math.random();

            wallet.button.show.wait(button)
            wallet.button.textify(button);

            setTimeout(()=>{
                if(rnd < 0.5) {
                    wallet.button.show.failure(button);
                } else {
                    wallet.button.show.success(button, ['0x468Fb92Cbc5706AcCF3FDEC075a02411c8d113cA'])
                }
            }, 10000)

        },
        fakeResponseMobile: (walletName) => {

            var button = wallet.help.getButtonFromString(walletName, 'desktop-mobile');
            // var button = document.getElementById('wallet-mobile-button-' + walletName);
            var rnd = Math.random();

            wallet.button.show.wait(button)
            wallet.button.textify(button);

            setTimeout(()=>{
                if(rnd < 0.5) {
                    wallet.button.show.failure(button);
                } else {
                    wallet.button.show.success(button, ['0x468Fb92Cbc5706AcCF3FDEC075a02411c8d113cA']);
                }
            }, 5000)

        },
        // for detecting chain name of EVM networks
        convertChainIDtoName: (id) => {

            if(id === '0x1' || id === '1') {
                chainName = 'Ethereum';
            } else if(id === '0x38' || id === '56') {
                chainName = 'Binance';
            } else if(id === '0x89' || id === '137') {
                chainName = 'Polygon';
            } else if(id === '0xfa' || id === '250') {
                chainName = 'Fantom';
            } else if (id === '0xA86A' || id === '43114') {
                chainName = 'Avalanche'
            } else if (id === '0xA4B1' || id === '42161') {
                chainName = 'Arbitrum'
            } else if (id === '0x19' || id === '25') {
                chainName = 'Chronos'
            }  else if (id === '0x63564C40' || id === '1666600000') {
                chainName = 'Harmony'
            }  else if (id === '0x6A' || id === '106') {
                chainName = 'Velas'
            }  else if (id === '0x80' || id === '128') {
                chainName = 'HECO' // huabi eco
            } else if (id === '0xA4EC' || id === '42220') {
                chainName = 'Celo'
            } else {
                chainName = id;
            }

            return chainName;

        }
    }
}

// --- EMITTER / LISTENER TO GET HIGHER LEVEL WINDOW OBJECT --- //

var win = undefined;
node.on('client-window', (msg) => {
    win = msg;
})
node.emit('html-window');



// --- BUTTON TEXT UPDATES --- //

wallet.button.show.success = (button, accounts, isMobile) => {

    var n, textDiv, emojiDiv;

    textDiv = button.children[1];

    // convert string account to array
    if(typeof(accounts) === 'string') {
        accounts = [accounts];
    }

    n = accounts.length;

    // need to account for the delayed animation command we have in the wait callback
    // this is for an edge case where the participant already registered its wallet
    // which may happen if refreshed the page after connecting some wallets
    setTimeout(()=>{

        textDiv.innerHTML = '✔ ...' + accounts[0].slice(-4);

        console.log(accounts[0]);

        if (n > 1) textDiv.innerText += ' (+' + n + ')';

    }, 200)


    if(isMobile) {
        emojiDiv = document.getElementById('wallet-information-text-2');
        emojiDiv.innerHTML += '🟢';
    }

}

wallet.button.show.wait = (button) => {

    wallet.button.textify(button);

    var waitDiv = '<img src="images/wait.gif" class="wallet-wait" />';
    var textDiv = button.children[1];

    textDiv.style.transition = '0.05s';
    textDiv.style.opacity = '0';

    setTimeout(()=>{
        button.children[1].innerHTML = waitDiv;
        textDiv.style.opacity = '1';
    }, 100)

}

wallet.button.show.failure = (button) => {

    // to do: some span for an icon for red cross failure
    button.children[0].style.filter = 'grayscale(1)';
    button.children[1].innerHTML = '⛔';

}

wallet.button.textify = (button) => {

    button.disabled = true;
    button.classList.add('texify');

}

wallet.button.buttonify = (button, name) => {

    button.classList.remove('texify');
    button.disabled = false;
    button.children[1].innerHTML = wallet.help.capitalizeFirstLetter(name);

}



// --- BUTTON DIV CREATION & ACTIVATION --- //

// GENERATE
wallet.createDiv.icon = (string) => {

    var t = '';
    t += '<span id="wallet-icon-' + string + '">';
    t += '<img src="images/walletIcons/' + string + '.png" class="wallet-icon" /></span>';

    return t;

}

wallet.createDiv.text = (string) => {

    var text = wallet.help.capitalizeFirstLetter(string);

    var t = '';
    t += '<span id="wallet-text-' + string + '" class="wallet-text">' + text + '</span>';

    return t;

}

wallet.createDiv.button = (string) => {

    var t = '';
    t += '<button id="wallet-button-' + string + '" class="btn btn-lg btn-dark button-extra">';
    t += wallet.createDiv.icon(string);
    t += wallet.createDiv.text(string);
    t += '</button>'

    return t;

}

// INJECT
wallet.button.inject = (string) => {

    var div = wallet.createDiv.button(string);
    var container = document.getElementById('wallet-button-container');
    container.innerHTML += div;

}

// ACTIVATE
wallet.button.activate = (string) => {

    var button = document.getElementById('wallet-button-' + string);
    button.onclick = wallet.connect[string];

}



// --- DETECTING EXTENSION WALLETS --- //

wallet.detectWallets = () => {

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



    // ALGORAND
    if(win.AlgoSigner != undefined) {
        wallet.check.algo.isAlgosigner = true;
    }



    // MINA
    if(win.mina != undefined) {
        wallet.check.mina.isAuro = true;
    }

}


// --- REGISTER DETECTED --- //

wallet.registerDetectionResults = () => {

    var detected = '';
    var undetected = '';

    var check = wallet.check;

    var dList = wallet.list.detected;
    var uList = wallet.list.undetected;

    if(check.isBtc) {
        dList.add('bitcoin');
        detected += '<br> btc - Unknown Wallet';

    } else {
        uList.add('bitcoin');
        undetected += '<br> btc - Unknown Wallet';
    }

    if(check.binance.isBinanceChain) {
        dList.add('binance');
        detected += '<br> bsc/eth - Binance Wallet';
    } else {
        uList.add('binance');
        undetected += '<br> bsc/eth - Binance Wallet';
    }

    if(check.eth.isMetaMask) {
        dList.add('metamask');
        detected += '<br> eth - Metamask';
    } else {
        uList.add('metamask');
        undetected += '<br> eth - Metamask';
    }

    if(check.eth.isXdefi) {
        dList.add('xdefi');
        detected += '<br> eth - XDefi';
    } else {
        uList.add('xdefi');
        undetected += '<br> eth - XDefi';
    }

    if(check.eth.isCoinBase) {
        detected += '<br> eth - Coinbase';
        dList.add('coinbase');
    } else {
        uList.add('coinbase');
        undetected += '<br> eth - Coinbase';
    }

    // dot

    if(check.dot.isPolkadotJs) {
        detected += '<br> dot - Polkadot-js';
        dList.add('polkadot');
    } else {
        uList.add('polkadot');
        undetected += '<br> dot - Polkadot-js';
    }

    // ada

    if(check.ada.isYoroi) {
        detected += '<br> ada - Yoroi';
        dList.add('yoroi');
    } else {
        uList.add('yoroi');
        undetected += '<br> ada - Yoroi';
    }

    if(check.ada.isNami) {
        detected += '<br> ada - Nami';
        dList.add('nami');
    } else {
        uList.add('nami');
        undetected += '<br> ada - Nami';
    }

    if(check.ada.isEternl) {
        detected += '<br> ada - Eternl';
        dList.add('eternl');
    } else {
        uList.add('eternl');
        undetected += '<br> ada - Eternl';
    }

    if(check.ada.isFlint) {
        detected += '<br> ada - Flint';
        dList.add('flint');
    } else {
        uList.add('flint');
        undetected += '<br> ada - Flint';
    }

    if(check.ada.isTyphon) {
        detected += '<br> ada - Typhon';
        dList.add('typhon');
    } else {
        uList.add('typhon');
        undetected += '<br> ada - Typhon';
    }

    // solana

    if(check.sol.isPhantom) {
        detected += '<br> sol - Phantom';
        dList.add('phantom');
    } else {
        uList.add('phantom');
        undetected += '<br> sol - Phantom';
    }

    if(check.sol.isSolflare) {
        detected += '<br> sol - Solflare';
        dList.add('solflare');
    } else {
        uList.add('solflare');
        undetected += '<br> sol - Solflare';
    }

    if(check.sol.isSlope) {
        detected += '<br> sol - Slope';
        dList.add('slope');
    } else {
        uList.add('slope');
        undetected += '<br> sol - Slope';
    }

    // cosmos

    if(check.cosmos.isKeplr) {
        detected += '<br> cosmos - Keplr';
        dList.add('keplr');
    } else {
        uList.add('keplr');
        undetected += '<br> cosmos - Keplr';
    }

    // tron

    if(check.tron.isTronlink) {
        detected += '<br> tron - Tronlink';
        dList.add('tronlink');
    } else {
        uList.add('tronlink');
        undetected += '<br> tron - Tronlink';
    }

    // algorand

    if(check.algo.isAlgosigner) {
        detected += '<br> algo - Algosigner';
        dList.add('algosigner');
    } else {
        uList.add('algosigner');
        undetected += '<br> algo - Algosigner';
    }

    // mina

    if(check.mina.isAuro) {
        detected += '<br> mina - Auro';
        dList.add('auro');
    } else {
        uList.add('auro');
        undetected += '<br> mina - Auro';
    }

    // kardia

    if(check.kardia.isKardia) {
        detected += '<br> kardia - Kai Wallet';
        dList.add('kardia');
    } else {
        uList.add('kardia');
        undetected += '<br> kardia - Kai Wallet';
    }

    // multi

    if(check.isClover.any()) {
        detected += '<br> dot/eth/kda/sol - Clover';
        dList.add('clover');
    } else {
        uList.add('clover');
        undetected += '<br> dot/eth/kda/sol - Clover ';
    }

    if(check.isMathWallet.any()) {
        detected += '<br> eth/atom/avax/tron/fantom/bsc/sol/dot/btc - Math';
        dList.add('math');
    } else {
        uList.add('math');
        undetected += '<br> eth/atom/avax/tron/fantom/bsc/sol/dot/btc - Math';
    }

    if(check.isCoin98.any()) {
        detected += '<br> eth/atom/kardia/avax/fantom/sol - Coin98';
        dList.add('coin98');
    } else {
        uList.add('coin98');
        undetected += '<br> eth/atom/kardia/avax/fantom/sol - Coin98';
    }

    document.getElementById('text-detected').innerHTML = detected;
    document.getElementById('text-undetected').innerHTML = undetected;

    console.log(wallet.list.detected);
    console.log(wallet.list.undetected);

}

wallet.button.detect = document.getElementById('wallet-button-detect');
wallet.button.detect.onclick = () => {

    // debug - will be replace by detect and register functions
    // wallet.list.detected = [
    //     'metamask',
    //     'yoroi',
    //     'phantom',
    //     'polkadot'
    // ]

    wallet.detectWallets();
    wallet.registerDetectionResults();

    wallet.list.detected.forEach(wallet.button.inject);
    wallet.list.detected.forEach(wallet.button.activate);

    document.getElementById('wallet-button-detect').style.display = 'none';

}

// --- CONNECTION --- //

wallet.connect.metamask = async () => {

    var button = wallet.help.getButtonFromString('metamask', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'metamask'
    }

    //--//

    var myProvider;

    if(wallet.check.eth.multipleProviders) {
        myProvider = win.ethereum.providers.find((provider) => provider.isMetaMask);
    }

    if(wallet.check.eth.singleProvider) {
        myProvider = win.ethereum;
    }


    try {

        await myProvider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {

            wallet.button.show.success(button, accounts);

            accounts.forEach(i => myWallet.address.push(i));

        })

        await myProvider
        .request({
            method: 'eth_chainId',
        })
        .then((myChainId) => {

            myWallet.chain = wallet.help.convertChainIDtoName(myChainId);

            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            // TO DO SEND IT TO THE TABLE

        })

    } catch(e) {
        console.log('Metamask error: ' + e);
        wallet.button.show.failure(button);
    }

}

wallet.connect.coinbase = async () => {


        var button = wallet.help.getButtonFromString('coinbase', 'extension');
        wallet.button.show.wait(button)

        var myWallet = {
            address: [],
            chain: undefined,
            type: 'extension',
            name: 'coinbase'
        }

        //--//

        var myProvider;

        if(wallet.check.eth.multipleProviders) {
            myProvider = win.ethereum.providers.find((provider) => provider.isCoinbaseWallet);
        }

        if(wallet.check.eth.singleProvider) {
            myProvider = win.ethereum.provider;
        }


        try {

            await myProvider
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {

                wallet.button.show.success(button, accounts);

                accounts.forEach(i => myWallet.address.push(i));

            })

            await myProvider
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                myWallet.chain = wallet.help.convertChainIDtoName(myChainId);

                wallet.list.connected.add(myWallet);

                console.log(wallet.list.connected);

                // TO DO SEND IT TO THE TABLE

            })

        } catch(e) {
            console.log('Coinbase error: ' + e);
            wallet.button.show.failure(button);
        }

}

wallet.connect.phantom = async () => {

    var button = wallet.help.getButtonFromString('phantom', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'phantom'
    }

    try {

        await win.solana.connect()
        .then((res)=>{

            myWallet.address = win.solana.publicKey.toString();
            myWallet.chain = 'Solana';
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // TO DO SEND IT TO THE TABLE

        })

    } catch (e) {
        console.log('Phantom error: ' + e);
        wallet.button.show.failure(button);
    }

}

wallet.connect.yoroi = async () => {

    var myAdaApi, unused, used, accounts;

    var button = wallet.help.getButtonFromString('yoroi', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'yoroi'
    }


    try {
        await win.cardano.yoroi.enable()
        .then((api) => {
            myAdaApi = api;
            return myAdaApi.getUsedAddresses();
        })
        .then((res) => {
            used = res;
            return myAdaApi.getUnusedAddresses();
        })
        .then((res)=>{


            unused = unused === undefined ? [] : unused;
            used = res;
            accounts = unused;

            console.log();
            console.log('yoroi:');
            console.log('unused');
            console.log(unused);
            console.log('used');
            console.log(used);
            console.log();

            used.forEach(i => accounts.push(i));

            myWallet.address = accounts;
            myWallet.chain = 'cardano';

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, accounts);

            // TO DO SEND IT TO THE TABLE


        })
    } catch (e) {
        console.log('yoroi wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}

wallet.connect.polkadot = async () => {

    var button = wallet.help.getButtonFromString('polkadot', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'polkadot'
    }

    try {

        var myProvider = win.injectedWeb3['polkadot-js'];

        myProvider.enable()
        .then((res)=>{
            return res.accounts.get()
        })
        .then((res)=>{

            myWallet.address = res[0].address;
            myWallet.chain = 'Polkadot';
            wallet.button.show.success(button, myWallet.address);

            console.log(wallet.list.connected);

            // TO DO SEND IT TO THE TABLE

        })

    } catch (e) {
        console.log('Polkadot-js error: ' + e);
        wallet.button.show.failure(button);
    }


}



// ---- MOBILE & DESKTOP WALLETS ---- //


// ---- ANIMATIONS --- //


// SHOW HIDE
wallet.mobile.showListContainer = () => {

    // show button list container
    var div = document.getElementById('wallet-walletConnect-buttonList-container');
    div.style.display = 'flex';

    // show button list
    wallet.mobile.showButtonList();

}

// ADD DISCONNECT FROM WALLET CONNECT HERE
wallet.mobile.hideListContainer = (showListBack) => {

    showListBack = showListBack === undefined ? false : showListBack;

    console.log('hide list container action');

    // hide button list container
    var div = document.getElementById('wallet-walletConnect-buttonList-container');
    div.style.display = 'none';

    // hide stolen qr code container
    wallet.mobile.hideQrCode();

    // destroy the hidden stolen qr code
    wallet.mobile.deleteQrCode();

    // destroy the injected wallet connect div
    wallet.mobile.deleteInjectedWCDiv();

    if(showListBack) {
        console.log('showing the button list back');
        div.style.display = 'flex';
        wallet.mobile.showButtonList();
    }

}

wallet.mobile.showButtonList = () => {
    var div = document.getElementById('wallet-walletConnect-buttonList');
    div.style.display = 'block';
}

wallet.mobile.hideButtonList = () => {
    var div = document.getElementById('wallet-walletConnect-buttonList');
    div.style.display = 'none';
}


// WC INJECTED DIV MANIPULATIONS

wallet.mobile.stealQrCode = () => {

    var parent = document.getElementById('walletconnect-qrcode-modal');

    if(parent != undefined) {

        var qrDiv = parent.children[0].children[2].children[0].children[1];
        // var qrDiv = parent.children[0].children[2];

        console.log(qrDiv);

        return qrDiv;

    } else {
        console.log('injected wallet connect div has not been found or the div is not yet injected ');
    }


}

wallet.mobile.hideWalletConnectDiv = () => {

    var div = document.getElementById('walletconnect-qrcode-modal');

    if(div != undefined) {
        div.style.display = 'none';
    } else {
        console.log('wallet qr code div does not exist');
    }

}

wallet.mobile.hideInjectedWCDiv = () => {

    var div = document.getElementById('walletconnect-wrapper');

    if(div != undefined) {
        div.style.display = 'none';
    } else {
        console.log('wallet connect wrapper does not exist');
    }

}

wallet.mobile.deleteQrCode = () => {

    var div = document.getElementById('wallet-qr-container');

    if(div.children.length > 0) {
        div.children[0].remove();
    } else {
        console.log('No wallet connect QR code div to delete has found!');
    }

    wallet.mobile.isQrCodeShown = false;

}

wallet.mobile.deleteInjectedWCDiv = () => {

    var div = document.getElementById('walletconnect-wrapper');

    if(div != undefined) {
        div.remove();
    } else {
        console.log('no injected Wallet Connect div to delete has found!');
    }

}

wallet.mobile.emptyQrDiv = () => {

    var myQrDiv = document.getElementById('wallet-qr-container');

    if(div != undefined) {
        myQrDiv.innerHTML = '';
    } else {
        console.log('no wallet qr container to empty out');
    }

}

wallet.mobile.isQrCodeShown = false;
wallet.mobile.showQrCode = () => {

    // steal the qr code
    var stolenQR = wallet.mobile.stealQrCode();
    console.log('stolen div');
    console.log(stolenQR);
    console.log('---');

    // place the stolen qr code to our predefined div
    var myQrDiv = document.getElementById('wallet-qr-container');

    if(myQrDiv != undefined && !wallet.mobile.isQrCodeShown) {

        // place the stolen qr into its new place
        myQrDiv.appendChild(stolenQR);

        // show our qr div
        myQrDiv.style.opacity = 0;
        myQrDiv.style.display = 'block';
        setTimeout(()=>{
            myQrDiv.style.transition = '0.2s';
            myQrDiv.style.opacity = 1;
        }, 20)

        // hide the wallet connect div
        wallet.mobile.hideWalletConnectDiv();

        wallet.mobile.isQrCodeShown = true;

    } else {
        console.log('It should be in the html but no div to place our stolen qr');
    }

}

wallet.mobile.hideQrCode = () => {

    var div = document.getElementById('wallet-qr-container');

    if(div != undefined) {
        div.style.display = 'none';
    } else {
        console.log('wallet-qr-container is deleted for some reason?');
    }

}

wallet.mobile.reformatWCDiv = () => {

    var div = document.getElementById('walletconnect-qrcode-modal').children[0];

    if(div != undefined) {

        div.style.transition = '0.5s';
        div.style.transform = 'scale(0.85)';
        div.style.top = '-2rem';

    } else {
        console.log('wallet connect is not found');
    }

}

wallet.mobile.manipulateWC = (string) => {

    if(string != 'other') {

        // manipulation on the injected wallet connect div
        setTimeout(()=>{

            // hide injected wc div
            wallet.mobile.hideInjectedWCDiv();
            // hide the button list
            wallet.mobile.hideButtonList();

            setTimeout(()=>{
                // hide injected wc div
                wallet.mobile.hideInjectedWCDiv();
                // hide the button list
                wallet.mobile.hideButtonList();
            }, 10)

        }, 10)

        setTimeout(()=>{
            wallet.mobile.showQrCode();
            setTimeout(()=>{
                wallet.mobile.showQrCode();
            }, 500)
        }, 500)

    } else {

        setTimeout(()=>{
            wallet.mobile.reformatWCDiv();
            setTimeout(()=>{
                wallet.mobile.reformatWCDiv();
            }, 500)
        }, 500)

    }

}


// BUTTON ACTIVATIONS FOR SHOW AND HIDE

var buttonWC = document.getElementById('wallet-button-walletConnect');
buttonWC.onclick = () => {
    wallet.mobile.showListContainer();
}
var backgroundWC = document.getElementById('wallet-walletConnect-buttonList-background');
backgroundWC.onclick = () => {
    showButtonListBack = false
    wallet.mobile.hideListContainer(showButtonListBack);
}


// --- CONNECTION --- //

var wc = {};

wallet.connect.mobile.fromDesktop = async (string) => {

    var button = wallet.help.getButtonFromString(string, 'desktop-mobile');
    wallet.button.show.wait(button)
    wallet.button.textify(button);

    var myWallet = {
        address: undefined,
        chain: undefined,
        type: (string != 'other') ? 'Mobile' : 'Mobile|Desktop',
        name: (string != 'other') ? string : 'Unknown'
    }

    // debug
    console.log('myWallet initiated: ');
    console.log(myWallet);

    wc.provider = new WalletConnectProvider.default({
        rpc: {
            1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
            25: "https://evm-cronos.crypto.org",
            56: "https://bsc-dataseed.binance.org/",
            59: 'https://api.eosargentina.io',
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
                "coinomi",
                "coin98",
            ],
        },
    });

    try {

        await wc.provider
        .enable()
        .then((address)=>{

            myWallet.address = address;

            wc.web3 = new Web3(wc.provider);
            wc.web3.eth.getChainId()
            .then((res)=>{

                console.log(res);
                console.log(typeof res);

                myWallet.chain = wallet.help.convertChainIDtoName(res.toString());

                decorateWalletConnectButton = true;
                wallet.button.show.success(button, myWallet.address, decorateWalletConnectButton);

                wallet.list.connected.add(myWallet);
                console.log(wallet.list.connected);

            })
        })
        .then(()=> {
            wc.provider.disconnect();
            var showButtonList = true;
            wallet.mobile.hideListContainer(showButtonList);
            // wc.hide.app();
        })

    } catch (switchError) {
        console.log(string + ' wallet Connect error');
        console.log(switchError.code);
        console.log(switchError);
        // wc.hide.app();
    }

}



// BUTTON ACTIVATION

// for all the mobile wallet buttons
wallet.button.mobile.activate = (string) => {

    console.log('button for ' + string);

    // get the button div from the string key
    var button = document.getElementById('wallet-mobile-button-' + string);



    // defining the button call back function given the button
    button.onclick = function() {

        // manipulation on the injected wallet connect div
        //
        // manipulation variation on 'other' button
        //
        wallet.mobile.manipulateWC(string);

        // defining the call back for the respective button given string
        wallet.connect.mobile.fromDesktop(string);

    }

}

wallet.list.mobile.forEach(wallet.button.mobile.activate);



// debug stuff
// wallet.list.detected = [
//     'metamask',
//     'coinbase',
//     'yoroi',
//     'phantom',
//     'polkadot'
// ]
// wallet.list.detected.forEach(wallet.button.inject);
// wallet.list.detected.forEach(wallet.button.activate);
