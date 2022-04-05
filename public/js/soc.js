function localConfirm(texts, cb) {
    var t;
    W.init({ waitScreen: true });
    t = '<div style="opacity: 1; height: 400px; color: black;">';
    t += '<br>';
    t += '<div class="modal" tabindex="-1" style="display: block">';
    t += '<div class="modal-dialog">';
    t += '<div class="modal-content">';
    t += '<div class="modal-header">';
    t += '<h5 class="modal-title">';

    t += '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16" style="opacity: 0.7; margin-right: 10px"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>';

    t += texts.title;
    t += '</h5>';
    // t += '<button id="modal-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="width: 0.2em; height: 0.2em; margin-right: 2px"></button>';
    t += '</div>';
    t += '<div class="modal-body">';
    t += '<p style="font-size: 0.7em; font-weight: 300">' +
        texts.text + '</p>';
    t += '</div>';
    t += '<div class="modal-footer">';
    t += '<button id="modal-cancel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">' + texts.cancel + '</button>';
    t += '<button id="modal-confirm" type="button" class="btn btn-primary">' + texts.confirm + '</button>';
    t += '</div>';
    t += '</div>';
    t += '</div>';
    t += '</div>';

    W.lockScreen(t);
    W.gid("modal-confirm").onclick = function () {
        W.unlockScreen();
        cb();
    };
    W.gid("modal-cancel").onclick = function () {
        W.unlockScreen();
    };
    // W.gid("modal-close").onclick = function() {
    //     W.unlockScreen();
    // };
}

function metamaskAccountsReceived(accounts) {
    var n;
    n = accounts.length;
    onboardButtonText.innerText =
        '✔ ...' + accounts[0].slice(-4);

    if (n > 1) onboardButtonText.innerText += ' (+' + n + ')';
    onboardButton.disabled = true;
}

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
        case 'Phantom':
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

        default:
            img = 'unknownCoin';
            break;
        // return '';
    }

    if (small) {
        style = 'width: 20px; margin: 0 8px 0 8px; border-radius:40px;';
    }
    else {
        style = 'width: 50px; margin: 10px 15px 20px 0px; border-radius: 50px;';
    }

    return '<img src="/coinIcons/' + img +
        '.png" style="' + style + '" title="' + b + '" />';

}

// Move all addresses into the shared addresses div.
accounts.forEach(function (a) {
    sendCryptoAddress('Ethereum', a, true);
});

function sendCryptoAddress(blockchain, address, metamask, send) {

    var addresses;
    if (send !== false) {
        node.set({
            crypto: address,
            blockchain: blockchain,
            isWallet: true,
            walletType: 'extension' || 'mobile' || 'desktop',
            walletName: 'metamask' || 'trust', // etc..
            metamask: metamask
        });

        addresses = node.game.session('crypto') || [];
        addresses.push({
            blockchain: blockchain,
            address: address,
            isWallet: true,
            walletType: 'extension' || 'mobile' || 'desktop',
            walletName: 'metamask' || 'trust', // etc..
            metamask: metamask
        });
        node.game.session('crypto', addresses);
    }

    moveToSent(blockchain, address, metamask);

};

var sent = document.getElementById("sent");

function moveToSent(blockchain, address, metamask) {
    var id, t, shortBl, shortAddr, tbody;
    // TODO: do something visually with metamask param.

    oneCryptoSent = true;
    fadeIn(sent, 'flex');

    shortAddr = shorten(address);
    shortBl = shorten(blockchain);

    tbody = document.querySelector('tbody');
    id = 'blockchain_' + counter;
    t = '';
    t += '<tr>'
    t += '<td>' + counter;
    if (metamask) t += ' ' + W.gid('metamask-logo-span').innerHTML;
    t += '</td>';
    t += '<td title="' + blockchain + '">';
    t += getBlockchainLogo(blockchain, true);
    t += shortBl;
    t += '</td>';
    t += '<td style="font-family: monospace, sans-serif" id="' + id + '" title="' + address + '">' + shortAddr + '</td>';
    tbody.innerHTML += t;
    counter++;
    W.adjustFrameHeight();
    if (sent.scrollIntoView) sent.scrollIntoView();

    // debug
    // console.log('inside sendCryptoAddress');
}

function shorten(t) {
    return t.length <= 10 ? t : t.substr(0, 6) + '...' + t.substr(t.length - 4);
}
