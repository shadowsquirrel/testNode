/**
 * # Player type implementation of the game stages
 * Copyright(c) 2022 Can Celebi <cnelebi@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        W.generateFrame();

        // waitroom
        W.init({ waitScreen: false });


        // POLKADOT
        node.on('html-window', function() {

            console.log('---------------');
            console.log(window.injectedWeb3);
            console.log('---------------');
            node.emit('client-window', window);

        })

        // SOLANA
        node.on('html-slope', async function() {

            console.log('slope message received from the client');

            var slope = new window.Slope();

            const { msg, data } = await slope.connect()

            if (msg === 'ok') {
                console.log(data.publicKey)
                node.emit('client-slope', data.publicKey)
            } else {
                console.log(msg)
                // User rejected the request.
                node.emit('client-slope-error', msg)
            }

        })

    });

    stager.extendStep('wallet', {
        // frame: 'walletAddressV4.htm',
        frame: 'newDesign.htm',
        cb: function() {

        }
    });

};
