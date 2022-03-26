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


        // var header;

        // header & frame
        // header = W.generateHeader();
        W.generateFrame();

        // waitroom
        W.init({ waitScreen: false });

    });

    stager.extendStep('wallet', {
        // frame: 'walletAddress.htm',
        frame: 'walletAddressV2.htm',
        cb: function() {

        }
    });

};
