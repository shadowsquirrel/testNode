var wallet = {
    connect: {},
    detect: undefined,
    createDiv: {
        button: undefined,
        walletIcon: undefined,
        walletText: undefined,
    },
    button: {
        inject: undefined,
        activate: undefined,
        show: {
            success: undefined,
            failure: undefined,
        },
        transform: undefined,

    },
    activate: {},
    list: {
        undetected: new Set(),  // [<string>, ...]
        detected: new Set(), // [<string>, ...]
        connected: new Set(), // [{type:<string>, name:<string>, chain:<string>, address:<string>}, ...]
    },
    change: {
        buttonText: undefined,
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

    },

    help: {}
}




wallet.help.capitalizeFirstLetter = (string) => {

    if(string != '') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return string;
    }

}




wallet.button.show.success = (button, accounts) => {

    var n, textDiv;

    textDiv = button.children[1];
    n = accounts.length;
    textDiv.innerText = '✔ ...' + accounts[0].slice(-4);

    if (n > 1) textDiv.innerText += ' (+' + n + ')';

}

wallet.button.show.wait = (button) => {

    button.children[1].innerHTML = 'Wait';

}

wallet.button.show.failure = (button) => {

    // to do: some span for an icon for red cross failure
    button.children[0].style.filter = 'grayscale(1)';
    button.children[1].innerHTML = '⛔';
    button.children[1]

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




wallet.button.inject = (string) => {

    var div = wallet.createDiv.button(string);
    var container = document.getElementById('wallet-button-container');
    container.innerHTML += div;

}

wallet.button.activate = (string) => {

    var button = document.getElementById('wallet-button-' + string);
    button.onclick = wallet.connect[string];

}




wallet.detect = () => {

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



wallet.connect.metamask = async () => {

    var walletName = 'metamask';
    console.log(walletName);

    var button = document.getElementById('wallet-button-' + walletName);

    wallet.button.show.wait(button)
    wallet.button.textify(button);
    wallet.button.show.failure(button);

}

wallet.connect.coinbase = async () => {
    console.log('coinbase');

    var walletName = 'coinbase';
    var button = document.getElementById('wallet-button-' + walletName);
    wallet.button.show.wait(button)
    wallet.button.textify(button);
    wallet.button.show.success(button, ['11111111111111111111111111'])
}

wallet.connect.phantom = async () => {
    console.log('phantom');
}

wallet.connect.yoroi = async () => {
    console.log('yoroi');
}

wallet.connect.polkadot = async () => {
    console.log('polkadot');
}




// debug
wallet.list.detected = [
    'metamask',
    'coinbase',
    'yoroi',
    'phantom',
    'polkadot'
]
wallet.list.detected.forEach(wallet.button.inject);
wallet.list.detected.forEach(wallet.button.activate);
