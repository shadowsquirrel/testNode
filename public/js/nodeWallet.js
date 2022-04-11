var node = parent.node;
var W = parent.W;

var wallet = {
    mobileConnect: undefined,
    mobileButton: undefined,
    NoDetectedExtensionWallets: undefined,
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
        mobile: {
            allWallets: [
                'metamask',
                'argent',
                'rainbow',
                'trust',
                'coinomi',
                'coin98',
                'other'
            ],
            predefinedWallets: [
                'metamask',
                'argent',
                'rainbow',
                'trust',
                'coinomi',
                'coin98',
                // additional list for desktop extension wallets
                'tronlink',
                'math'
            ],
            connected: [],
        },
    },
    change: {
        buttonText: undefined,
    },
    mobile: {
        showListContainer: undefined,
        hideListContainer: undefined,
        showQrCode: undefined,
        other:{
            generateNewButton: undefined,
            newButtonCounter: 0,
        }
    },
    alert: {
        show: undefined,
        hide: undefined,
        background: undefined,
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
            cosmos: false,
            terra: false,
            any: function() {
                var x = wallet.check.isCoin98;
                return (x.eth || x.sol || x.binance || x.ronin || x.kardia || x.avax || x.fantom || x.cosmos || x.terra);
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
        activateDeleteButton: undefined,
        capitalizeFirstLetter: (string) => {

            if(string != '') {
                return string.charAt(0).toUpperCase() + string.slice(1);
            } else {
                return string;
            }

        },
        // TO DO: need to defined the type for other cases
        getButtonFromString: (string, type) => {

            if(type === undefined) {
                console.log('Warning! getButtonfromString -> type is not defined!');
            }

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

            console.log('chain id received: ' + id);

            if(id === '0x1' || id === '1') {
                chainName = 'Ethereum';
            } else if(id === '0x38' || id === '56') {
                chainName = 'Binance';
            } else if(id === '0x89' || id === '137') {
                chainName = 'Polygon';
            } else if(id === '0xFA' || id === '0xfa' || id === '250') {
                chainName = 'Fantom';
            } else if (id === '' || id === '0xa86a' || id === '43114') {
                chainName = 'Avalanche'
            } else if (id === '0xA4B1' || id === '0xa4b1' || id === '42161') {
                chainName = 'Arbitrum'
            } else if (id === '0x19' || id === '25') {
                chainName = 'Chronos'
            }  else if (id === '0x63564C40' || id === '0x63564c40' || id === '1666600000') {
                chainName = 'Harmony'
            }  else if (id === '0x6A' || id === '0x6a' || id === '106') {
                chainName = 'Velas'
            }  else if (id === '0x80' || id === '128') {
                chainName = 'HECO' // huabi eco
            } else if (id === '0xA4EC' || id === '0xa4ec' || id === '42220') {
                chainName = 'Celo'
            } else if (id === '0x3B' || id === '0x3b' || id === '59') {
                chainName = 'EOS'
            } else if (id === '0x7E4' || id === '0x7e4' || id === '2020') {
                chainName = 'Ronin'
            } else {
                chainName = id;
            }

            console.log('chain name identified: ' + chainName);

            return chainName;

        },
        // getBalance: async (address, type, myProvider) => {
        //
        //     var balance;
        //
        //     if(type === 'evm') {
        //
        //         var web3 = new Web3(myProvider);
        //
        //         await myProvider
        //         .request({method: 'eth_getBalance', params:[address, "latest"]})
        //         .then((res) => {
        //             console.log('balance');
        //             console.log(res);
        //             console.log(web3.utils.fromWei(res, 'ether'));
        //             balance = web3.utils.fromWei(res, 'ether');
        //             return balance;
        //         })
        //
        //     }
        //
        //     if(type === 'solana') {
        //
        //         await myProvider
        //         .request({method: 'getBalance', params:address})
        //         .then((res) => {
        //             console.log(res);
        //         })
        //
        //     }
        //
        // }
    },

    node: {
        addresses: [], //
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

    console.log('');
    console.log('-----');
    console.log('button.show.success');
    // console.log(button);

    textDiv = button.children[1];

    // console.log('text div');
    // console.log(textDiv);


    // convert string account to array
    if(typeof(accounts) === 'string') {
        accounts = [accounts];
    }

    n = accounts.length;


    // need to account for the delayed animation command we have in the wait callback
    // this is for an edge case where the participant already registered its wallet
    // which may happen if refreshed the page after connecting some wallets
    setTimeout(()=>{

        console.log('');
        console.log('accounts');
        console.log(accounts);
        console.log('----');
        console.log('');

        textDiv.innerHTML = '✔ ...' + accounts[0].slice(-4);

        if (n > 1) textDiv.innerText += ' (+' + n + ')';

    }, 500)


    if(isMobile) {
        emojiDiv = document.getElementById('wallet-information-text-2');
        emojiDiv.innerHTML += '🟢';
    }

}

wallet.button.show.wait = (button) => {

    wallet.button.textify(button);

    var waitDiv = '<img src="images/walletIcons/wait.gif" class="wallet-wait" />';
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

wallet.button.show.noWalletDetected = (button) => {

    button.children[1].innerHTML = 'No extension wallet is detected 😕';
    button.style.width = '100%';

}

wallet.button.textify = (button) => {

    button.disabled = true;
    button.classList.add('texify');

}

wallet.button.buttonify = (button, name) => {

    var text;

    button.classList.remove('texify');
    button.disabled = false;
    button.children[0].style.filter = 'grayscale(0)';

    if(!wallet.list.mobile.predefinedWallets.includes(name)) {
        text = 'Other';
    } else {
        text = wallet.help.capitalizeFirstLetter(name);
    }

    console.log('buttonify text: ' + text);
    button.children[1].style.transition = '0.05s';
    button.children[1].style.opacity = 0;
    setTimeout(()=>{
        button.children[1].innerHTML = text;
        button.children[1].style.opacity = 1;
    }, 200)


}


// --- ALERT SCREEN SETUP --- //

wallet.alert.show = (name) => {

    name = name === undefined ? 'Unknown' : name;

    var div = document.getElementById('wallet-alert-container');
    div.style.display = 'flex';

    var divName = document.getElementById('alertWalletName');
    divName.innerHTML = name;

}

wallet.alert.hide = () => {

    var div = document.getElementById('wallet-alert-container');
    div.style.display = 'none';

}

wallet.alert.background = document.getElementById('wallet-alert-background');

wallet.alert.background.onclick = wallet.alert.hide;



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
    // solana, kardia, cosmos, terra
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
        window.coin98.sol.request({ method: 'has_wallet', params: ['solana'] })
        .then(() => {

            wallet.check.isCoin98.sol = true;
            console.log('coin98 sol wallet exists');
            // updates the already register detection results
            wallet.registerDetectionResults();

            // check if the button is already generated
            var button = wallet.help.getButtonFromString('coin98', 'extension');
            if(button === undefined) {
                console.log('isCoin98 button becomes active after the fact and the buttons is being created slightly later');
                wallet.button.inject('coin98');
                wallet.button.activate('coin98');
            }

        }).catch(e => {
            wallet.check.isCoin98.sol = false;
            console.log('coin98 sol wallet does not exist');
            console.log('error we receive: ');
            console.log(e);
        })

        // cosmos & terra
        if(window.coin98.cosmos != undefined) {
            if(window.coin98.cosmos('cosmos') != undefined) {
                wallet.check.isCoin98.cosmos = true;
            }
            if(window.coin98.cosmos('terra') != undefined) {
                wallet.check.isCoin98.terra = true;
            }
        }

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


// --- REGISTER DETECTED WALLETS --- //

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

// tie the detection and creation of extension wallet to a button click
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

    if(wallet.list.detected.size > 0) {

        wallet.list.detected.forEach(wallet.button.inject);
        wallet.list.detected.forEach(wallet.button.activate);

        wallet.NoDetectedExtensionWallets = wallet.list.detected.length;

        document.getElementById('wallet-button-detect').style.display = 'none';

    } else {

        console.log('No extension wallets are detected');

        var button = document.getElementById('wallet-button-detect');
        wallet.button.textify(button);
        wallet.button.show.noWalletDetected(button);
        wallet.NoDetectedExtensionWallets = 0;

    }

}

// ------------------ //
// --- CONNECTION --- //
// ------------------ //

// BITCOIN

// bitcoin
//
// NOTE: while exploring various multi chain wallets I have observed 2 common
// ways to connect to the wallet. Both of these method are accounted for here
// Also I have encountered 2 common ways to detect a bitcoin wallet through the injected
// bitcoin object. Yet for some reason, wallets fail to also add some items to identify
// which wallet this may be. Therefore for bitcoin we have a separate generic connect
// bitcoin button to whatever bitcoin wallet active
//
wallet.help.bitcoinConnectedToAtLeastOneAddress = false;
wallet.connect.bitcoin = async () => {

    var button = wallet.help.getButtonFromString('bitcoin', 'extension');
    wallet.button.show.wait(button)

    var addresses = [];
    var wallets = [];

    var myWallet1 = {
        address: [],
        chain: 'Bitcoin',
        type: 'extension',
        name: 'unknown bitcoin wallet 1'
    }

    // math wallet way
    if(win.bitcoin.getAccount != undefined) {
        try {
            await win.bitcoin.getAccount()
            .then(res => {
                myWallet1.address = [res.address];
                addresses = addresses.concat(myWallet1.address);
                wallet.button.show.success(button, addresses);
                wallet.help.bitcoinConnectedToAtLeastOneAddress = true;
                wallet.list.connected.add(myWallet1);
                wallets.push(myWallet1);

                wallet.save(myWallet1);

            })
        } catch (e) {
            console.log('unknown bitcoin wallet error 1: ' + e);
            if(!wallet.help.bitcoinConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }

    var myWallet2 = {
        address: [],
        chain: 'Bitcoin',
        type: 'extension',
        name: 'unknown bitcoin wallet 2'
    }

    // liquality way
    if(win.bitcoin.enable != undefined) {
        try {
            await win.bitcoin.enable()
            .then(res => {
                myWallet2.address = [res[0].address];
                addresses = addresses.concat(myWallet2.address);
                wallet.button.show.success(button, addresses);
                wallet.help.bitcoinConnectedToAtLeastOneAddress = true;
                wallet.list.connected.add(myWallet2);
                wallets.push(myWallet2);

                wallet.save(myWallet2);

            })
        } catch (e) {
            console.log('unknown bitcoin wallet error 2: ' + e);
            if(!wallet.help.bitcoinConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }

    console.log(wallets);

}


// EVM

// metamask
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
        myProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    }

    if(wallet.check.eth.singleProvider) {
        myProvider = window.ethereum;
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

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);


        })

        // wallet.help.getBalance(myWallet.address[0], 'evm', myProvider);

    } catch(e) {
        console.log('Metamask error: ' + e);
        wallet.button.show.failure(button);
    }

}

// coinbase
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
        myProvider = window.ethereum.providers.find((provider) => provider.isCoinbaseWallet);
    }

    if(wallet.check.eth.singleProvider) {
        myProvider = window.ethereum.provider;
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

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })

    } catch(e) {
        console.log('Coinbase error: ' + e);
        wallet.button.show.failure(button);
    }

}

// binance
wallet.connect.binance = async () => {

    var button = wallet.help.getButtonFromString('binance', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'binance'
    }

    var myProvider = win.BinanceChain;

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

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);


        })

    } catch (e) {

        console.log('Binance wallet error: ' + e);
        wallet.button.show.failure(button);

    }

}

// xdefi
wallet.connect.xdefi = async () => {

    var button = wallet.help.getButtonFromString('xdefi', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'xdefi'
    }

    try {

        var myProvider = win.xfi.ethereum;

        await myProvider
        .request({
            method: 'eth_requestAccounts'
        })
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

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);


        })

    } catch (e) {
        console.log('xdefi wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// SOLANA

// phantom
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

            myWallet.address = [win.solana.publicKey.toString()];
            myWallet.chain = 'Solana';
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            wallet.save(myWallet);

            // wallet.help.getBalance(myWallet.address, 'solana', win.solana)

        })

    } catch (e) {
        console.log('Phantom error: ' + e);
        wallet.button.show.failure(button);
    }

}

// solflare
wallet.connect.solflare = async () => {

    var button = wallet.help.getButtonFromString('solflare', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'solflare'
    }

    try {

        var myProvider = window.solflare;

        await myProvider.connect()
        .then((res)=>{

            myWallet.address = [window.solflare.publicKey.toString()];
            myWallet.chain = 'Solana';
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })

    } catch (e) {
        console.log('Solflare error: ' + e);
        wallet.button.show.failure(button);
    }
}

// slope
var slopeSwitch = true;
wallet.connect.slope = async () => {

    var button = wallet.help.getButtonFromString('slope', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'slope'
    }

    node.on('client-slope', function(address) {

        myWallet.address = [address];
        myWallet.chain = 'Solana';
        wallet.list.connected.add(myWallet);

        console.log(wallet.list.connected);

        wallet.button.show.success(button, myWallet.address);

        // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

        wallet.save(myWallet);

    })

    node.on('client-slope-error', function(msg) {
        console.log('Slope wallet error ' + msg);
        wallet.button.show.failure(button);
    })

    if(slopeSwitch) {
        slopeSwitch = false;
        node.emit('html-slope');
    }

}


// CARDANO

// yoroi
wallet.connect.yoroi = async () => {

    var myAdaApi, unused, used, reward, change, accounts;

    var button = wallet.help.getButtonFromString('yoroi', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Cardano',
        type: 'extension',
        name: 'yoroi'
    }


    try {
        await win.cardano.yoroi.enable()
        .then((api) => {
            myAdaApi = api;
            return myAdaApi.getUsedAddresses();
        })
        .then((res1) => {
            used = res1;
            return myAdaApi.getUnusedAddresses();
        })
        .then((res2) => {
            unused = res2;
            return myAdaApi.getRewardAddresses();
        })
        .then((res3) => {
            reward = res3;
            return myAdaApi.getChangeAddress();
        })
        .then((res4) => {

            change = res4;

            console.log();
            console.log('yoroi:');
            console.log('unused');
            console.log(unused);
            console.log('used');
            console.log(used);
            console.log('reward');
            console.log(reward);
            console.log('change');
            console.log(change);
            console.log();

            // order: unused, reward, used, change
            accounts = unused.concat(reward).concat(used).concat(change);

            console.log('accounts');
            console.log(accounts);

            myWallet.address = accounts;

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, accounts);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('yoroi wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}

// nami
wallet.connect.nami = async () => {

    var myAdaApi, unused, used, accounts;

    var button = wallet.help.getButtonFromString('nami', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Cardano',
        type: 'extension',
        name: 'nami'
    }

    try {
        await win.cardano.nami.enable()
        .then((api) => {
            myAdaApi = api;
            return myAdaApi.getUsedAddresses();
        })
        .then((res1) => {
            used = res1;
            return myAdaApi.getUnusedAddresses();
        })
        .then((res2) => {
            unused = res2;
            return myAdaApi.getRewardAddresses();
        })
        .then((res3) => {
            reward = res3;
            return myAdaApi.getChangeAddress();
        })
        .then((res4) => {

            change = res4;

            console.log();
            console.log('nami:');
            console.log('unused');
            console.log(unused);
            console.log('used');
            console.log(used);
            console.log('reward');
            console.log(reward);
            console.log('change');
            console.log(change);
            console.log();

            // order: unused, reward, used, change
            accounts = unused.concat(reward).concat(used).concat(change);

            console.log('accounts');
            console.log(accounts);

            myWallet.address = accounts;

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, accounts);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('nami wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}

// eternl
wallet.connect.eternl = async () => {

    var myAdaApi, unused, used, accounts;

    var button = wallet.help.getButtonFromString('eternl', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Cardano',
        type: 'extension',
        name: 'eternl'
    }

    try {
        await win.cardano.eternl.enable()
        .then((api) => {
            myAdaApi = api;
            return myAdaApi.getUsedAddresses();
        })
        .then((res1) => {
            used = res1;
            return myAdaApi.getUnusedAddresses();
        })
        .then((res2) => {
            unused = res2;
            return myAdaApi.getRewardAddresses();
        })
        .then((res3) => {
            reward = res3;
            return myAdaApi.getChangeAddress();
        })
        .then((res4) => {

            change = res4;

            console.log();
            console.log('eternl:');
            console.log('unused');
            console.log(unused);
            console.log('used');
            console.log(used);
            console.log('reward');
            console.log(reward);
            console.log('change');
            console.log(change);
            console.log();

            // order: unused, reward, used, change
            accounts = unused.concat(reward).concat(used).concat(change);

            console.log('accounts');
            console.log(accounts);

            myWallet.address = accounts;

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, accounts);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('eternl wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}

// flint
wallet.connect.flint = async () => {

    var myAdaApi, unused, used, accounts;

    var button = wallet.help.getButtonFromString('flint', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Cardano',
        type: 'extension',
        name: 'flint'
    }

    try {
        await win.cardano.flint.enable()
        .then((api) => {
            myAdaApi = api;
            return myAdaApi.getUsedAddresses();
        })
        .then((res1) => {
            used = res1;
            return myAdaApi.getUnusedAddresses();
        })
        .then((res2) => {
            unused = res2;
            return myAdaApi.getRewardAddresses();
        })
        .then((res3) => {
            reward = res3;
            return myAdaApi.getChangeAddress();
        })
        .then((res4) => {

            change = res4;

            console.log();
            console.log('flint:');
            console.log('unused');
            console.log(unused);
            console.log('used');
            console.log(used);
            console.log('reward');
            console.log(reward);
            console.log('change');
            console.log(change);
            console.log();

            // order: unused, reward, used, change
            accounts = unused.concat(reward).concat(used).concat(change);

            console.log('accounts');
            console.log(accounts);

            myWallet.address = accounts;

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, accounts);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('flint wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}

// typhon
wallet.connect.typhon = async () => {

    var button = wallet.help.getButtonFromString('typhon', 'extension');
    wallet.button.show.wait(button)

    var address, reward;

    var myWallet = {
        address: [],
        chain: 'Cardano',
        type: 'extension',
        name: 'typhon'
    }

    try {

        await win.cardano.typhon.enable()
        .then(() => {
            return win.cardano.typhon.getAddress();
        })
        .then((res1) => {
            address = [res1.data];
            return win.cardano.typhon.getRewardAddress();
        })
        .then((res2) => {
            reward = [res2.data];

            console.log('typhon');
            console.log('address');
            console.log(address);
            console.log('reward');
            console.log(reward);

            myWallet.address = address.concat(reward);

            wallet.list.connected.add(myWallet);
            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('typhon wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// POLKADOT

// dot-js
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

            myWallet.address = [res[0].address];
            myWallet.chain = 'Polkadot';
            wallet.button.show.success(button, myWallet.address);

            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })

    } catch (e) {
        console.log('Polkadot-js error: ' + e);
        wallet.button.show.failure(button);
    }


}


// COSMOS

// keplr
wallet.connect.keplr = async () => {

    var button = wallet.help.getButtonFromString('keplr', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Cosmos',
        type: 'extension',
        name: 'keplr'
    }

    try {

        var chainId = "cosmoshub-4";

        await window.keplr.enable(chainId);

        var offlineSigner = window.keplr.getOfflineSigner(chainId);

        await offlineSigner
        .getAccounts()
        .then((accounts)=>{

            myWallet.address = accounts.map(i => i.address);
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        });

    } catch (e) {
        console.log('Keplr error: ' + e);
        wallet.button.show.failure(button);
    }

}


// TRON

// tronlink
wallet.connect.tronlink = async () => {

    var button = wallet.help.getButtonFromString('tronlink', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Tron',
        type: 'extension',
        name: 'tronlink'
    }

    try {
        win.tronLink.request({
            method:'tron_requestAccounts'
        })
        .then((res)=>{

            if(!win.tronWeb.defaultAddress.base58) {

                wallet.alert.show('Tronlink');
                wallet.button.buttonify(button, 'tronlink');
                return;

            } else {

                console.log(win.tronWeb.defaultAddress.base58);
                myWallet.address = [win.tronWeb.defaultAddress.base58];
                wallet.list.connected.add(myWallet);

                console.log(wallet.list.connected);

                wallet.button.show.success(button, myWallet.address);

                // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

                wallet.save(myWallet);

            }

        })
    } catch (e) {
        console.log('Tronlink wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// ALGORAND

// algosigner
//
// NOTE: if the wallet owner closes the account login page, we cannot catch that
// thus no error is returned thus we get stuck in waiting animation forever..
// though regular reject connection is accounted for as usual
//
wallet.connect.algosigner = async () => {

    var button = wallet.help.getButtonFromString('algosigner', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Algorand',
        type: 'extension',
        name: 'algosigner'
    }

    try {
        await win.AlgoSigner.connect().then((res)=>{
            return win.AlgoSigner.accounts({ledger:'MainNet'});
        }).then((res)=>{

            myWallet.address = [res[0].address];

            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('algosigner wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// MINA

// auro
//
// NOTE: if the wallet owner closes the account login page, we cannot catch that
// thus no error is returned thus we get stuck in waiting animation forever..
// though regular reject connection is accounted for as usual
//
// NOTE: UPON NOT ALLOWING CONNECTION WE ARE UNABLE TO CATCH THE ERROR ALTOUGH
// WE ARE INSIDE TRY AND CATCH
//
wallet.connect.auro = async () => {

    var button = wallet.help.getButtonFromString('auro', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Mina',
        type: 'extension',
        name: 'auro'
    }

    try {
        window.mina.requestAccounts()
        .then((accounts) => {

            myWallet.address = accounts;
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('Auro wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// KARDIA

// kardia
//
// NOTE: shitty wallet, you don't need to be logged in to be connected as long as you were
// connected before. No where to find a disconnect from the connected page button
// continuously injects stupid shit to the browser which leads to its eventual crash
//
wallet.connect.kardia = async () => {

    var button = wallet.help.getButtonFromString('kardia', 'extension');
    wallet.button.show.wait(button)

    var myWallet = {
        address: [],
        chain: 'Kardia',
        type: 'extension',
        name: 'kardia'
    }

    try {
        win.kardiachain.enable().then((accounts) => {

            myWallet.address = accounts;
            wallet.list.connected.add(myWallet);

            console.log(wallet.list.connected);

            wallet.button.show.success(button, myWallet.address);

            // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

            wallet.save(myWallet);

        })
    } catch (e) {
        console.log('kardia wallet error: ' + e);
        wallet.button.show.failure(button);
    }

}


// MUTLI CHAIN

// clover
//
// NOTE: we are trying to get the address for all possible chains
// eth, dot, sol and kda. For each we generate a new wallet object
// at the end we have a list of wallet objects that needs to be used
// to be passed on to the table
//
wallet.help.cloverConnectedToAtLeastOneAddress = false;
wallet.connect.clover = async () => {

    var button = wallet.help.getButtonFromString('clover', 'extension');
    wallet.button.show.wait(button)


    var wallets = [];
    var allAddresses = [];
    var isClover = wallet.check.isClover;

    // ETHEREUM
    var myEthWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'clover'
    }

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

                allAddresses = allAddresses.concat(accounts);
                accounts.forEach(i => myEthWallet.address.push(i));
                wallet.button.show.success(button, allAddresses);
                wallet.help.cloverConnectedToAtLeastOneAddress = true;

            })

            await cloverProvider
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                myEthWallet.chain = wallet.help.convertChainIDtoName(myChainId);
                wallet.list.connected.add(myEthWallet);
                wallets.push(myEthWallet);


                // sendCryptoAddress(myEthWallet.chain, myEthWallet.address, myEthWallet);
                wallet.save(myEthWallet);

            })

        } catch (e) {
            console.log('clover wallet - eth - error: ' + e);
            wallet.button.show.failure(button);
        }

    }


    // POLKADOT
    var myDotWallet = {
        address: [],
        chain: 'Polkadot',
        type: 'extension',
        name: 'clover'
    }

    if(isClover.dot) {
        try {

            win.injectedWeb3.clover
            .enable()
            .then((res) => {
                someProvider = res.accounts.get();
                return someProvider;
            })
            .then((res) => {

                myDotWallet.address = [res[0].address];
                wallet.list.connected.add(myDotWallet);
                wallets.push(myDotWallet);
                allAddresses = allAddresses.concat(myDotWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.cloverConnectedToAtLeastOneAddress = true;

                // sendCryptoAddress(myDotWallet.chain, myDotWallet.address, myDotWallet);

                wallet.save(myDotWallet);

            })

        } catch (e) {
            console.log('Clover wallet polkadot error: ' + e);
            if(!wallet.help.cloverConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }

        }
    }


    // SOLANA
    var mySolWallet = {
        address: [],
        chain: 'Solana',
        type: 'extension',
        name: 'clover'
    }

    if(isClover.sol) {

        try {
            await window.clover_solana
            .getAccount()
            .then((account)=>{

                mySolWallet.address = [account];
                wallet.list.connected.add(mySolWallet);
                wallets.push(mySolWallet);
                allAddresses = allAddresses.concat(mySolWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.cloverConnectedToAtLeastOneAddress = true;

                // sendCryptoAddress(mySolWallet.chain, mySolWallet.address, mySolWallet);

                wallet.save(mySolWallet);

            })
        } catch (e) {
            console.log('Clover wallet solana error: ' + e);
            if(!wallet.help.cloverConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }


    // KADENA
    var myKDAWallet = {
        address: [],
        chain: 'Kadena',
        type: 'extension',
        name: 'clover'
    }

    if(isClover.kda) {
        try {
            await win.clover_kadena
            .getAccount()
            .then((account)=>{

                myKDAWallet.address = [account];
                wallet.list.connected.add(myKDAWallet);
                wallets.push(myKDAWallet);
                allAddresses = allAddresses.concat(myKDAWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.cloverConnectedToAtLeastOneAddress = true;

                // sendCryptoAddress(myKDAWallet.chain, myKDAWallet.address, myKDAWallet);

                wallet.save(myKDAWallet);

            })
        } catch (e) {
            console.log('Clover wallet kadena error: ' + e);
            if(!wallet.help.cloverConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }
    }

    console.log(wallets);

}

// math
//
// NOTE: unlike clover we can only get the active chain from the math wallet
// we could have consider genaring a new math button wallet after each connection
// then hope that the participant changes its active network -> this will result in
// refreshing of page thus we do not have to worry about it the math button will be
// refreshed if that is the case
//
// I also try to account for not being logged into the wallet. If in 15 seconds,
// you are logged but you do not connect your wallet then you will receive an alarm
// as if you are not logged in
//
//
wallet.help.mathConnectedToAtLeastOneAddress = false;
wallet.connect.math = async () => {

    var button = wallet.help.getButtonFromString('math', 'extension');
    wallet.button.show.wait(button);

    var wallets = [];
    var allAddresses = [];



    var isMath = wallet.check.isMathWallet;

    var someAddress = undefined;

    // for EVM chains other than eth (polygon, binance)
    var someProvider = undefined;
    var someChain = undefined;
    var chainName = undefined;

    // ETHEREUM (eth, binance, polygon)
    var myEthWallet = {
        address: [],
        chain: undefined,
        type: 'extension',
        name: 'math'
    }

    if(isMath.eth) {

        try {

            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
            })
            .then((accounts) => {

                allAddresses = allAddresses.concat(accounts);
                accounts.forEach(i => myEthWallet.address.push(i));
                wallet.button.show.success(button, allAddresses);
                wallet.help.mathConnectedToAtLeastOneAddress = true;

            })

            await window.ethereum
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                myEthWallet.chain = wallet.help.convertChainIDtoName(myChainId);
                wallet.list.connected.add(myEthWallet);
                wallets.push(myEthWallet);

                console.log(wallets);

                // sendCryptoAddress(myEthWallet.chain, myEthWallet.address, myEthWallet);
                wallet.save(myEthWallet);

            })

        } catch (e) {
            console.log('Math wallet EVM error: ' + e);
            wallet.button.show.failure(button);
        }

    }

    // SOLANA
    var mySolWallet = {
        address: [],
        chain: 'Solana',
        type: 'extension',
        name: 'math'
    }

    if(isMath.sol) {

        try {
            await window.solana
            .getAccount()
            .then((account)=>{

                mySolWallet.address = [account];
                wallet.list.connected.add(mySolWallet);
                wallets.push(mySolWallet);
                allAddresses = allAddresses.concat(mySolWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.mathConnectedToAtLeastOneAddress = true;

                console.log(wallets);

                // sendCryptoAddress(mySolWallet.chain, mySolWallet.address, mySolWallet);
                wallet.save(mySolWallet);

            })
        } catch (e) {
            console.log('Math wallet solana error: ' + e);
            if(!wallet.help.mathConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }

    // POLKADOT
    var myDotWallet = {
        address: [],
        chain: 'Polkadot',
        type: 'extension',
        name: 'math'
    }

    if(isMath.dot) {

        try {

            win.injectedWeb3.mathwallet
            .enable()
            .then((res) => {
                someProvider = res.accounts.get();
                return someProvider;
            })
            .then((res) => {

                myDotWallet.address = [res[0].address];
                wallet.list.connected.add(myDotWallet);
                wallets.push(myDotWallet);
                allAddresses = allAddresses.concat(myDotWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.mathConnectedToAtLeastOneAddress = true;

                console.log(wallets);

                // sendCryptoAddress(myDotWallet.chain, myDotWallet.address, myDotWallet);

                wallet.save(myDotWallet);

            })

        } catch (e) {
            console.log('Math wallet polkadot error: ' + e);
            if(!wallet.help.mathConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }

    // TRON
    var myTronWallet = {
        address: [],
        chain: 'Tron',
        type: 'extension',
        name: 'math'
    }

    if(isMath.tron) {

        try {
            if(tronWeb.defaultAddress != undefined) {

                myTronWallet.address = [win.tronWeb.defaultAddress.base58];
                wallet.list.connected.add(myTronWallet);
                wallets.push(myTronWallet);
                allAddresses = allAddresses.concat(myTronWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.mathConnectedToAtLeastOneAddress = true;

                console.log(wallets);

                // sendCryptoAddress(myTronWallet.chain, myTronWallet.address, myTronWallet);

                wallet.save(myTronWallet);

            } else {
                console.log('tron address for math wallet does not exist');
            }

        } catch (e) {
            console.log('Math wallet tron error: ' + e);
            if(!wallet.help.mathConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    }

    // COSMOS -> shitty api we ignore...

    // FANTOM -> eth method covers it

    // BTC -> accounted for by a differetn bitcoin specific button

    setTimeout(()=>{
        if(!wallet.help.mathConnectedToAtLeastOneAddress) {
            wallet.alert.show('Math');
            setTimeout(()=>{
                if(!wallet.help.mathConnectedToAtLeastOneAddress) {
                    wallet.button.buttonify(button, 'math');
                }
            }, 5000)
        }
    }, 10000)




}

// coin98
//
// NOTE: fetches multiple addresses that are available like clover but unlike clover
// different chains and addresses need to be defined earlier by the wallet user
// therefore there is not guarantee of  having multiple addresses.
// coin98 has multiple conflict disablers that causes to not inject EVM, Tron and kardia
// chain related addresses. If these are disabled my best guess is that the wallet will be
// used for dot or solana chains which are checked for and if they exist are fetched
// in addition we check for cosmos and terra accounts if they exist they are also fetched
// So like clover and unlike math wallet to get multiple addresses there are no needs for
// reloading of the page
//
// wheteher a solana wallet exists is done in a peculiar way where
// a request is made to the wallet and if it is fullfilled it is added to the list of
// addresses that will be fetched. This process occurs 1second more than the other ones therefore
// if coin98 wallet only has solana its button will appear 1 second later
//
wallet.help.coin98ConnectedToAtLeastOneAddress = false;
wallet.connect.coin98 = async () => {

    var button = wallet.help.getButtonFromString('coin98', 'extension');
    wallet.button.show.wait(button);

    var isCoin98 = wallet.check.isCoin98;

    var wallets = [];
    var allAddresses = [];

    // ETHEREUM (eth, binance, polygon)

    var myEthWallet = {
        chain: undefined,
        address: [],
        type: 'extension',
        name: 'coin98'
    }

    if(isCoin98.eth) {

        console.log('evm action');

        try {
            await window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {

                if(accounts.length === 0) {

                    console.log('there are no evm addresses for coin98');

                } else {

                    allAddresses = allAddresses.concat(accounts);
                    accounts.forEach(i => myEthWallet.address.push(i));
                    wallet.button.show.success(button, allAddresses);
                    wallet.help.coin98ConnectedToAtLeastOneAddress = true;

                }

            })

            await window.ethereum
            .request({
                method: 'eth_chainId',
            })
            .then((myChainId) => {

                if(myEthWallet.address.length != 0) {

                    myEthWallet.chain = wallet.help.convertChainIDtoName(myChainId);
                    wallet.list.connected.add(myEthWallet);
                    wallets.push(myEthWallet);

                    console.log(wallets);

                    // sendCryptoAddress(myEthWallet.chain, myEthWallet.address, myEthWallet);
                    wallet.save(myEthWallet);

                } else {

                    console.log('Coin98: Also no evm address no evm chain id');

                }

            })
        } catch (e) {
            console.log('Coin98 wallet EVM error: ' + e);
            wallet.button.show.failure(button);
        }

    } else {
        console.log('no evm chain in coin98');
    }


    // SOLANA

    var mySolWallet = {
        chain: 'Solana',
        address: [],
        type: 'extension',
        name: 'coin98'
    }

    // once connected you can get the solana chain too
    // just check that the account that is returned is not empty
    if(isCoin98.sol) {

        console.log('solana action');

        try {
            await window.coin98.sol
            .request({method: 'sol_accounts'})
            .then((accounts) => {

                if(accounts.length === 0) {
                    console.log('Coin98 wallet -> No Solana Account!');
                } else {
                    mySolWallet.address = accounts;
                    wallet.list.connected.add(mySolWallet);
                    allAddresses = allAddresses.concat(mySolWallet.address);
                    wallet.button.show.success(button, allAddresses);
                    wallets.push(mySolWallet);
                    wallet.help.coin98ConnectedToAtLeastOneAddress = true;

                    console.log('solana');
                    console.log(accounts);
                    console.log(mySolWallet);
                    console.log(wallets);

                    // sendCryptoAddress(mySolWallet.chain, mySolWallet.address, mySolWallet);
                    wallet.save(mySolWallet);

                }

            })
        } catch (e) {
            console.log('Coin98 wallet solana error: ' + e);
            if(!wallet.help.coin98ConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    } else {
        console.log('no solana chain in coin98');
    }


    // KARDIA

    var myKardiaWallet = {
        chain: 'Kardia',
        address: [],
        type: 'extension',
        name: 'coin98'
    }

    if(isCoin98.kardia) {

        console.log('kardia action');

        try {
            await win.kardiachain.enable()
            .then((accounts) => {

                myKardiaWallet.address = accounts;
                wallet.list.connected.add(myKardiaWallet);
                wallets.push(myKardiaWallet);
                allAddresses = allAddresses.concat(myKardiaWallet.address);
                wallet.button.show.success(button, allAddresses);
                wallet.help.coin98ConnectedToAtLeastOneAddress = true;

                console.log('kardia');
                console.log(accounts);
                console.log(myKardiaWallet);
                console.log(wallets);

                // sendCryptoAddress(myKardiaWallet.chain, myKardiaWallet.address, myKardiaWallet);
                wallet.save(myKardiaWallet);

            })
        } catch (e) {
            console.log('Coin98 wallet kardia error: ' + e);
            if(!wallet.help.coin98ConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }

    } else {
        console.log('no kardia chain in coin98');
    }


    // COSMOS

    var myCosmosWallet = {
        chain: 'Cosmos',
        address: [],
        type: 'extension',
        name: 'coin98'
    }

    if(isCoin98.cosmos) {

        console.log('cosmos action');

        try {

            var cosmos = window.coin98.cosmos('cosmos');

            await cosmos.request({method: 'cosmos_accounts'})
            .then((accounts) => {

                if(accounts.length === 0) {
                    console.log('no cosmos address available for coin98');
                } else {
                    myCosmosWallet.address = accounts;
                    wallet.list.connected.add(myCosmosWallet);
                    wallets.push(myCosmosWallet);
                    allAddresses = allAddresses.concat(myCosmosWallet.address);
                    wallet.button.show.success(button, allAddresses);
                    wallet.help.coin98ConnectedToAtLeastOneAddress = true;

                    console.log(wallets);

                    // sendCryptoAddress(myCosmosWallet.chain, myCosmosWallet.address, myCosmosWallet);
                    wallet.save(myCosmosWallet);

                }

            })
        } catch (e) {
            console.log('Coin98 wallet cosmos error: ' + e);
            if(!wallet.help.coin98ConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }
    }


    // TERRA

    var myTerraWallet = {
        chain: 'Terra',
        address: [],
        type: 'extension',
        name: 'coin98'
    }

    if(isCoin98.terra) {
        try {

            var terra = window.coin98.cosmos('terra');

            await terra.request({method: 'cosmos_accounts'})
            .then((accounts) => {

                if(accounts.length === 0) {
                    console.log('no cosmos address available for coin98');
                } else {
                    myTerraWallet.address = accounts;
                    wallet.list.connected.add(myTerraWallet);
                    wallets.push(myTerraWallet);
                    allAddresses = allAddresses.concat(myTerraWallet.address);
                    wallet.button.show.success(button, allAddresses);
                    wallet.help.coin98ConnectedToAtLeastOneAddress = true;

                    console.log(wallets);

                    // sendCryptoAddress(myTerraWallet.chain, myTerraWallet.address, myTerraWallet);
                    wallet.save(myTerraWallet);

                }

            })
        } catch (e) {
            console.log('Coin98 wallet terra error: ' + e);
            if(!wallet.help.coin98ConnectedToAtLeastOneAddress) {
                wallet.button.show.failure(button);
            }
        }
    }


    // debug
    console.log(isCoin98);

}




// ---------------------------------- //
// ---- MOBILE & DESKTOP WALLETS ---- //
// ---------------------------------- //

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

        div.style.transition = '0.05s';
        div.style.transform = 'scale(0.9)';
        div.style.top = '0rem';

        parent.scrollTo(0, 0);

    } else {
        console.log('wallet connect is not found');
    }

}

wallet.mobile.reformatMobileWCDiv = () => {

    var div = document.getElementById('walletconnect-qrcode-modal').children[0];

    if(div != undefined) {

        div.style.transition = '0.5s';
        div.style.transform = 'scale(1.5)';
        div.style.top = '20rem';

    } else {
        console.log('wallet connect for mobile is not found');
    }

}

wallet.mobile.manipulateWC = (string) => {

    // if(string != 'other') {
    if(wallet.list.mobile.predefinedWallets.includes(string)) {

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

wallet.mobile.refreshButtonState = () => {

    var list = wallet.list.mobile.allWallets;

    list.forEach((string) => {

        if(!wallet.list.mobile.connected.includes(string)) {

            var button = wallet.help.getButtonFromString(string, 'desktop-mobile');
            var name = string;

            wallet.button.buttonify(button, name);

        } else {

        }

    });

}

wallet.mobile.other.generateNewButton = () => {

    var div = '';
    var n = wallet.mobile.other.newButtonCounter
    var string = 'other-' + n;

    wallet.list.mobile.allWallets.push(string);

    div += '<button id="wallet-mobile-button-other-' + n + '" class="btn btn-lg btn-dark button-extra-4">';
    div += '<span id="wallet-mobile-icon-other-' + n + '">';
    div += '<img src="images/walletIcons/walletConnect.png" class="wallet-mobile-icon" /></span>';
    div += '<span id="wallet-mobile-text-other-' + n + '" class="wallet-text">Other</span></button>';

    var container = document.getElementById('wallet-mobile-button-extra')

    // container.append(div);
    container.innerHTML += div;

    var button = document.getElementById(('wallet-mobile-button-other-' + n));

    button.onclick = () => {

        console.log('button clicked from ' + string);

        // manipulation on the injected wallet connect div
        //
        // manipulation variation on 'other' button
        //
        wallet.mobile.manipulateWC(string);

        // defining the call back for the respective button given string
        wallet.connect.mobile.fromDesktop(string);

    }

    wallet.mobile.other.newButtonCounter++;

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
    wallet.mobile.refreshButtonState();
}

// ------------------ //
// --- CONNECTION --- //
// ------------------ //

var wc = {};

wallet.connect.mobile.fromDesktop = async (string) => {

    var button = wallet.help.getButtonFromString(string, 'desktop-mobile');
    wallet.button.show.wait(button)
    wallet.button.textify(button);

    var isOther = !wallet.list.mobile.predefinedWallets.includes(string);

    var myWallet = {
        address: undefined,
        chain: undefined,
        // type: (string != 'other') ? 'Mobile' : 'Mobile or Desktop',
        // name: (string != 'other') ? string : 'Unknown'
        type: !isOther ? 'Mobile' : 'Mobile or Desktop',
        name: !isOther ? string : 'Unknown'
    }

    // debug
    console.log('myWallet initiated: ');
    console.log(myWallet);

    wc.provider = new WalletConnectProvider.default({
        rpc: {
            // eth
            1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
            // chronos
            25: "https://evm-cronos.crypto.org",
            // binance
            56: "https://bsc-dataseed.binance.org/",
            // eos
            59: 'https://api.eosargentina.io',
            // polygon
            137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
            // avalanche
            43114: "https://api.avax.network/ext/bc/C/rpc",
            // harmony
            1666600000: "https://api.harmony.one",
            // HECO
            128: "wss://ws-mainnet.hecochain.com",
            // arbitrum
            42161: "https://rpc.ankr.com/arbitrum",
            // fantom
            250: "https://rpc.ankr.com/arbitrum",
            // Velas
            106: "https://rpc.ankr.com/arbitrum",
            // Celo
            42220: "https://forno.celo.org"
        },
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModalOptions: {
            mobileLinks: [
                "trust",
                "rainbow",
                "metamask",
                "argent",
                "coinomi",
                "coin98",
                'mathwallet',
                'crypto.com',
                'bitpay',
                'ledger',
                'zelcore',
                '1inch',
                'celowallet',
                'alphawallet',
                'nash',
                'steakwallet',
                "imtoken",
                "pillar"
            ],
        },
    });

    try {

        await wc.provider
        .enable()
        .then((address)=>{

            // get address
            myWallet.address = address;

            // get chain if it is EVM wallet
            wc.web3 = new Web3(wc.provider);
            if(wc.web3.eth != undefined) { // check if EVM

                wc.web3.eth.getChainId()
                .then((res)=>{

                    console.log(res);
                    console.log(typeof res);

                    myWallet.chain = wallet.help.convertChainIDtoName(res.toString());

                    wallet.list.connected.add(myWallet);
                    console.log(wallet.list.connected);

                    // notice here we are also adding possible desktop wallets into the mobile list
                    wallet.list.mobile.connected.push(string);
                    console.log(wallet.list.mobile.connected);

                    // for other button - need to account for strings other, other-0, other-1, etc
                    // thus check isOther by checking whether it is predefined
                    // add a new other button for further collection of other wallet addresses
                    if(isOther) {
                        console.log('');
                        console.log('A new other button is being generated');
                        console.log('');
                        wallet.mobile.other.generateNewButton();
                    }

                    // the long name is for explanatory purposes
                    // redefined button after the string is modified
                    button = wallet.help.getButtonFromString(string, 'desktop-mobile');
                    decorateWalletConnectButton = true;
                    wallet.button.show.success(button, myWallet.address, decorateWalletConnectButton);

                    // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);
                    wallet.save(myWallet);

                })

            }

        })
        .then(()=> {
            wc.provider.disconnect();
            var showButtonList = true;
            wallet.mobile.hideListContainer(showButtonList);
        })

    } catch (switchError) {
        console.log(string + ' wallet Connect error');
        console.log(switchError.code);
        console.log(switchError);
        wallet.button.show.failure(button);
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

wallet.list.mobile.allWallets.forEach(wallet.button.mobile.activate);


// -------------------------------------------- //
// --- FOR SMARTPHONES WALLET CONNECT SETUP --- //
// -------------------------------------------- //

wallet.mobileConnect = async () => {

    console.log('smartphone mobileConnect');

    var myWallet = {
        address: undefined,
        chain: undefined,
        type: 'mobile mobile',
        name: 'Unknown'
    }

    // debug
    console.log('myWallet initiated: ');
    console.log(myWallet);

    wc.provider = new WalletConnectProvider.default({
        rpc: {
            // eth
            1: "https://cloudflare-eth.com/", // https://ethereumnodes.com/
            // chronos
            25: "https://evm-cronos.crypto.org",
            // binance
            56: "https://bsc-dataseed.binance.org/",
            // eos
            59: 'https://api.eosargentina.io',
            // polygon
            137: "https://polygon-rpc.com/", // https://docs.polygon.technology/docs/develop/network-details/network/
            // avalanche
            43114: "https://api.avax.network/ext/bc/C/rpc",
            // harmony
            1666600000: "https://api.harmony.one",
            // HECO
            128: "wss://ws-mainnet.hecochain.com",
            // arbitrum
            42161: "https://rpc.ankr.com/arbitrum",
            // fantom
            250: "https://rpc.ankr.com/arbitrum",
            // Velas
            106: "https://rpc.ankr.com/arbitrum",
            // Celo
            42220: "https://forno.celo.org"
        },
        bridge: 'https://bridge.walletconnect.org',
    });

    try {

        await wc.provider
        .enable()
        .then((address)=>{

            myWallet.address = address;

            wc.web3 = new Web3(wc.provider);
            if(wc.web3.eth != undefined) {

                wc.web3.eth.getChainId()
                .then((res)=>{

                    console.log(res);
                    console.log(typeof res);

                    myWallet.chain = wallet.help.convertChainIDtoName(res.toString());

                    wallet.list.connected.add(myWallet);
                    console.log(wallet.list.connected);

                    wallet.list.mobile.connected.push(string);
                    console.log(wallet.list.mobile.connected);


                    // sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);
                    wallet.save(myWallet);

                })

            }

        })
        .then(()=> {
            wc.provider.disconnect();
        })

    } catch (switchError) {
        console.log(string + ' wallet Connect error for smartphones');
        console.log(switchError.code);
        console.log(switchError);
    }

}

wallet.mobileButton = document.getElementById('wallet-button-walletConnect-mobile');

wallet.mobileButton.onclick = () => {

    setTimeout(()=>{
        wallet.mobile.reformatMobileWCDiv();
        setTimeout(()=>{
            wallet.mobile.reformatMobileWCDiv();
            setTimeout(()=>{
                wallet.mobile.reformatMobileWCDiv();
                setTimeout(()=>{
                    wallet.mobile.reformatMobileWCDiv();
                    setTimeout(()=>{
                        wallet.mobile.reformatMobileWCDiv();
                    }, 200)
                }, 200)
            }, 200)
        }, 200)
    }, 200)


    wallet.mobileConnect();

}




wallet.save = (myWallet) => {

    console.log('Wallet: ' + myWallet.name);
    console.log('Address(es): ' + myWallet.address);

    if(myWallet.address.length != 0) {

        myWallet.address.forEach((address) => {

            // send the wallet to the database
            // call for move to send to move it to the table
            sendCryptoAddress(myWallet.chain, address, myWallet);

        })

    } else {
        console.log('There are no wallets in: ');
        console.log(myWallet);;
    }

    // activate delete buttons on the table
    wallet.help.updateTableDeleteButton();

    W.adjustFrameHeight();

}

// we use the address to find the address in the addresses list and delete
// we use the counter to find the id in the table and delete it
wallet.delete = (address, tableIndex) => {

    // delete the address from the database
    console.log('before');
    console.log(wallet.node.addresses);

    var index = wallet.getIndex(address);

    console.log('index retreived');
    console.log(index);
    console.log('wallet to be deleted');
    console.log(wallet.node.addresses[index]);

    wallet.node.addresses.splice(index, 1);

    console.log('after');
    console.log(wallet.node.addresses);

    // delete the address from the table
    var row = document.getElementById(('table-' + tableIndex));
    row.style.transition = '0.15s';
    row.style.background = 'lavenderblush';
    row.style.transform = 'scaleY(0)';
    setTimeout(()=>{
        row.remove();
    }, 250)


}

wallet.getIndex = (address) => {

    console.log('looking for address');
    console.log(address);

    var myWallet;
    var myIndex;

    for(var i = 0; i < wallet.node.addresses.length; i++) {

        myWallet = wallet.node.addresses[i];

        if(myWallet.address === address) {

            console.log('wallet found!');
            console.log(wallet);
            console.log('wallet address');
            console.log(wallet.address);
            console.log('wallet index');
            console.log(i);

            myIndex = i;

        }

    }

    return myIndex;

}

wallet.help.getAddressFromTableId = (index) => {

    // console.log('get address from table id');
    // console.log(index);

    var row = document.getElementById('blockchain_' + index);
    var address = row.title;

    return address;

}


wallet.help.updateDeleteButton = (row) => {

    var index = parseInt(row.id.split('-')[1]);

    var address = wallet.help.getAddressFromTableId(index);

    console.log(index);
    console.log(address);

    wallet.delete(address, index);

}


wallet.help.updateTableDeleteButton = () => {

    var rowIndex, deleteButton;

    var table =document.querySelector('tbody');

    var tableArray = Array.from(table.children);


    tableArray.forEach((row) => {

        // console.log(row);
        // console.log(row.id);

        // rowIndex = parseInt(row.id.split('-')[1]);

        // console.log(rowIndex);

        deleteButton = row.children[3].children[0];

        // console.log(deleteButton);

        deleteButton.onclick = () => {

            wallet.help.updateDeleteButton(row)

        }

    })

}


// --- SOC CODE MODIFIED --- //

var sent = document.getElementById("sent");

function getBlockchainLogo(b, small) {
    var img, style;

    switch (b) {
        case 'Algorand':
            img = 'ALGO';
            break;
        case 'Avalanche':
            img = 'AVAX';
            break;
        case 'Binance':
            img = 'BNB';
            break;
        case 'Bitcoin':
            img = 'BTC';
            break;
        case 'Cardano':
            img = 'ADA';
            break;
        case 'Cosmos':
            img = 'ATOM';
            break;
        case 'EOS':
            img = 'EOS';
            break;
        case 'Ethereum':
            img = 'ETH';
            break;
        case 'Near':
            img = 'NEAR';
            break;
        case 'Fantom':
            img = 'FTM';
            break;
        case 'Polkadot':
            img = 'DOT';
            break;
        case 'Solana':
            img = 'SOL';
            break;
        case 'Tron':
            img = 'TRX';
            break;
        case 'Chronos':
            img = 'CRO';
            break;
        case 'Velas':
            img = 'VLX';
            break;
        case 'Celo':
            img = 'CELO';
            break;
        case 'Polygon':
            img = 'MATIC';
            break;
        case 'Ronin':
            img = 'RON';
            break;
        case 'Mina':
            img = 'MINA';
            break;
        case 'Kardia':
            img = 'KAI';
            break;
        case 'Kadena':
            img = 'KDA';
            break;
        case 'Terra':
            img = 'LUNA';
            break
        default:
            img = 'unknownCoin';
            break;
    }

    if (small) {
        style = 'width: 20px; margin: 0 8px 0 8px; border-radius:40px;';
    }
    else {
        style = 'width: 50px; margin: 10px 15px 20px 0px; border-radius: 50px;';
    }
    return '<img src="images/coinIcons/' + img +
        '.png" style="' + style + '" title="' + b + '" />';

}



function sendCryptoAddress(blockchain, address, myWallet, send) {

    // var addresses;
    if (send !== false) {

        node.set({
            address: address,
            blockchain: blockchain,
            isWallet: (myWallet != undefined),
            walletType: myWallet.type,
            walletName: myWallet.name,
        });

        // uncomment this later
        // wallet.node.addresses = node.game.session('crypto') || [];
        // we predefine wallet.node.addresses in the wallet object then by calling this
        // function we update it

        wallet.node.addresses.push({
            address: address,
            blockchain: blockchain,
            isWallet: (myWallet != undefined),
            walletType: myWallet.type,
            walletName: myWallet.name,
        });

        // uncomment this later
        // node.game.session('crypto', wallet.node.addresses);

    }

    moveToSent(blockchain, address, myWallet);

};

var counter = 1;
function moveToSent(blockchain, address, myWallet) {

    var id, t, shortBl, shortAddr, tbody;

    // uncomment these later
    // oneCryptoSent = true;
    // fadeIn(sent, 'flex');

    shortAddr = shorten(address);
    shortBl = shorten(blockchain);

    var walletCoinLogoDiv = '';
    if(myWallet != undefined) {
        if(myWallet.name != 'Unknown') {
            walletCoinLogoDiv += '<img id="table-coin-icon" src="images/walletIcons/' + myWallet.name + '.png"/>';
        } else {
            walletCoinLogoDiv += '<img id="table-coin-icon" src="images/walletIcons/' + 'walletConnect' + '.png"/>';
        }
    }

    tbody = document.querySelector('tbody');
    id = 'blockchain_' + counter;
    t = '';
    t += '<tr id="table-' + counter + '">';
    t += '<td>' + counter;
    // t += walletCoinLogoDiv;
    t += '</td>';
    t += '<td title="' + blockchain + '">';
    t += (walletCoinLogoDiv + getBlockchainLogo(blockchain, true));
    t += shortBl;
    t += '</td>';
    t += '<td style="font-family: monospace, sans-serif" id="' + id + '" title="' + address + '">' + shortAddr + '</td>';
    t += '<td class="table-row-delete" id="delete-icon-' + counter + '"><img id="table-delete-icon-' + counter + '" class="table-delete-general-icon-class" src="images/walletIcons/delete.png"/></td>';
    tbody.innerHTML += t;

    counter++;

    // uncomment these later
    // W.adjustFrameHeight();
    // if (sent.scrollIntoView) sent.scrollIntoView();

}

function shorten(t) {
    return t.length <= 10 ? t : t.substr(0, 6) + '...' + t.substr(t.length - 4);
}


wallet.list.connected.forEach((myWallet) => {

    sendCryptoAddress(myWallet.chain, myWallet.address, myWallet);

})


// function for a single wallet
//
wallet.help.transferToDataAndTable = (wallet) => {

    var accounts = wallet.address;

    for(var i = 0; i < accounts.length; i++) {

        sendCryptoAddress(myWallet.chain, accounts[i], myWallet);

    }

}
