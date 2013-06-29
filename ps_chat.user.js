// ==UserScript==
// @name         Puzzle Strike Chat Enhancement
// @namespace    pschat 
// @include      http://fantasystrike.com/game/index.php*
// @include      http://www.fantasystrike.com/game/index.php*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @author       dereferenced
// @description  Changes the look and feel of the chat log in Puzzle Strike on FantasyStrike.com
// @version      1.0.1
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// CSS
var css = '\
    .label {\
        font-size: 11.998px;\
        font-weight: bold;\
        line-height: 14px;\
        color: #ffffff;\
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\
        white-space: nowrap;\
        vertical-align: baseline;\
        background-color: #999999;\
        padding: 1px 4px 2px;\
        -webkit-border-radius: 3px;\
            -moz-border-radius: 3px;\
                border-radius: 3px;\
    }\
    .label-red    { background-color: #F94F4F; }\
    .label-purple { background-color: #E73CED; }\
    .label-brown  { background-color: #E29C54; }\
    .label-gold   { background-color: #C4A54A; }\
    .label-blue   { background-color: #6BA6F6; }\
    .base03    { color: #002b36; }\
    .base02    { color: #073642; }\
    .base01    { color: #586e75; }\
    .base00    { color: #657b83; }\
    .base0     { color: #839496; }\
    .base1     { color: #93a1a1; }\
    .base2     { color: #eee8d5; }\
    .base3     { color: #fdf6e3; }\
    .yellow    { color: #b58900; }\
    .orange    { color: #cb4b16; }\
    .red       { color: #dc322f; }\
    .magenta   { color: #d33682; }\
    .violet    { color: #6c71c4; }\
    .blue      { color: #268bd2; }\
    .cyan      { color: #2aa198; }\
    .green     { color: #859900; }\
    .player    { color: #268bd2; font-size: 20px; font-weight: bold; margin-top: 10px; }\
    .solarizedLight { \
        color: #586e75; \
        background-color: #FDF6E3;\
    }\
    .solarizedDark { \
        color: #839496;\
        background-color: #002b36;\
    }\
';
GM_addStyle(css);

// PS CHAT
$.psChat = {
    chipReplacements: {
        colors: {
            purple: [
                'Double Crash Gem',
                'Combinatorics', 
                'Combine',
                'Crash Gem',
                'Gems to Gemonade',
                'One True Style',
                'Strength of Earth',
                'Stone Wall',
                'Reversal',
                'Unstable Power',
                'Double Slash',
                'Deathstrike Dragon',
                'Healing Touch',
                'Crash Bomb',
                'Crash Potato'
            ],
            blue: [
                'Blues are Good',
                'Ebb or Flow',
                'Improvisation',
                'Money for Nothing',
                'Self-Improvement',
                'Thinking Ahead',
                'Bubble Shield',
                'Riposte',
                'Always in Control',
                'Saving Grace'
            ],
            red: [
                'Chip Damage',
                'Color Panic',
                'Dashing Strike',
                'Just a Scratch',
                'Knockdown',
                'Ouch!',
                'Pick Your Poison',
                'Pick your Poison',
                'Repeated Jabs',
                'Sneak Attack',
                'Stolen Purples',
                'Pilebunker',
                'Hex of Murkwood',
                'Burning Vigor',
                'Shadowswarm',
                'Pleasure & Pain',
                "Mistress's Command",
                'Bonecracker',
                'Surgical Strike'
            ],
            gold: [
                'Master Puzzler',
                'The Hammer'
            ],
            brown: [
                'Axe Kick',
                'Bang then Fizzle',
                'Button Mashing',
                'Chips for Free',
                'Chips For Free',
                'Combos Are Hard',
                'Combos are Hard',
                'Custom Combo',
                'Degenerate Trasher',
                'Draw Three',
                'Gem Essence',
                'Hundred-Fist Frenzy',
                'Iron Defense',
                "It's a Trap",
                "It's Combo Time",
                'Now or Later',
                'One of Each',
                'One-Two Punch',
                'Punch, Punch, Kick',
                'Recklessness',
                'Risk to Riskonade',
                'Risky Move',
                'Roundhouse',
                'Safe Keeping',
                'Sale Prices',
                'Secret Move',
                'Signature Move',
                'Training Day',
                'X-Copy',
                'Big Rocks',
                'Research and Development',
                "It's Time for the Past",
                'Future Sight',
                'Troublesome Rhetoric',
                'No More Lies',
                'Purge Bad Habits',
                'Dragon Form',
                'Rigorous Training',
                'Creative Thoughts',
                'Three Colors',
                'Double-take',
                'Speed of the Fox',
                'Bag of Tricks',
                'Versatile Style',
                'Martial Mastery',
                'Protective Ward',
                'Living on the Edge',
                'Jackpot',
                "Panda's Bargain",
                'Playing with Fire',
                'Burnbarrow',
                'Patriot Mirror',
                'Two Truths',
                'Flagstone Tax',
                'Wartime Tactics',
                'Cog Engine',
                'Upgrade',
                'Into Oblivion',
                'Radiant Healing',
                'Stunlock',
                'Acrobatics',
                'Maximum Anarchy',
                'More Shiny',
                'Beast Unleashed',
                'Giant Growth'
            ],
            grey: [
                'Option Select',
                'Shadow Plague',
                'Wound'
            ],
            redblue:    ['Really Annoying'],
            redpurple:  ['Mix-Master'],
            purpleblue: ['Rocket Punch'],
            chromatic:  ['Chromatic Orb']
        },
    },
    initalSetup: function() {
        $("#divChat2").after( jQuery('<div/>', {
            id: 'divChat2Parsed',
            class: "divChat solarizedLight",
        }));
        //$("#divChat2").hide();
        $("#divChat2Parsed").css("font-family", 'Calibri, Tahoma, Helvetica, Arial, Verdana, sans-serif');
    },
    transformLine: function(line) {
        for (var color in $.psChat.chipReplacements.colors) {
            if (color === 'length' || !$.psChat.chipReplacements.colors.hasOwnProperty(color)) { continue; }
            $( $.psChat.chipReplacements.colors[color] ).each(function(i, chip) {
                line = line.replace(chip, '<span class="label label-' + color + '">' + chip + '</span>');
            });
        }
        line = line.replace(/1-gem/gi, '<img src="http://fantasystrike.com/forums/img/22px-PS_1gem.png">');
        line = line.replace(/2-gem/gi, '<img src="http://fantasystrike.com/forums/img/22px-PS_2gem.png">');
        line = line.replace(/3-gem/gi, '<img src="http://fantasystrike.com/forums/img/22px-PS_3gem.png">');
        line = line.replace(/4-gem/gi, '<img src="http://fantasystrike.com/forums/img/22px-PS_4gem.png">');

        line = line.replace(/\+black arrow/g,  '<img src="http://fantasystrike.com/forums/img/23px-PS_Black_Arrow.png">');

        var chipimg = '<img src="http://fantasystrike.com/forums/img/20px-PS_Chip.png">';
        line = line.replace(/\+chip/g,  chipimg);
        /*
        line = line.replace(/1 chip/g,  chipimg);
        line = line.replace(/2 chips/g, chipimg + chipimg);
        line = line.replace(/3 chips/g, chipimg + chipimg + chipimg);
        line = line.replace(/4 chips/g, chipimg + chipimg + chipimg + chipimg);
        line = line.replace(/5 chips/g, chipimg + chipimg + chipimg + chipimg + chipimg);
        line = line.replace(/6 chips/g, chipimg + chipimg + chipimg + chipimg + chipimg + chipimg);
        line = line.replace(/7 chips/g, chipimg + chipimg + chipimg + chipimg + chipimg + chipimg + chipimg);
        */
        return line;
    },
    parseChatTimeout: null,
    parseChatDelay: function() {
        clearTimeout( $.psChat.parseChatTimeout );
        $.psChat.parseChatTimeout = setTimeout( function() { $.psChat.parseChat(); }, 100 );
    },
    parseChat: function() {
        var oldelement = $("#divChat2");
        var newelement = $("#divChat2Parsed");

        var lines = oldelement.html().split('<br>');
        var lastplayer = '';
        var lastverb   = '';

        newelement.empty();
        newelement.height( oldelement.height() ); 
        newelement.width(  oldelement.width()  ); 
        oldelement.hide();

        var start_flag = 0;  // 0 = haven't seen start. 1 = seen start.  2 = seen start, seen next player, '-' is now reaction instead of starting chip
        var interjection_last = 0;

        $(lines).each(function(i, line) {

            if (line == '') { return; }

            line = line.replace(/^\n?<span.*?<\/span>/, "");
            var pvarray = line.split(" ", 2);
            var player  = pvarray[0];
            var verb    = pvarray[1];
            var params  = line.replace(/^\S+ \S+ /, "");

            var newturn = 0;

            /*
            console.log(line);
            console.log(player);
            console.log('--');
            console.log(verb);
            console.log(params);
            console.log('--end--');
            console.log('--');
            console.log('--');
            console.log('--');
            */

            // Game start stuff
            if (player == 'Starting') {
                start_flag = 1;
                newelement.append("<div style='margin-top: 10px'><strong>Starting the game with</strong></div>");
                return;
            }
            if (player == '-' && start_flag == 1) {
                var newline = line.replace(/^\n?- /, "");
                newelement.append( $.psChat.transformLine(newline) + " " );
                return;
            }

            // Interjections (the game starts talking about player 2 during player 1's turn)
            if (player == '--' || (player == '-' && start_flag == 2)) {
                // Forget the last verb and make a newline, we won't be able to combine stuff anymore
                var newline = '<span class="red">&raquo;</span> <i>' + line.replace(/^--? /, "") + '</i>';
                newelement.append( (interjection_last ? "" : "<br>") + $.psChat.transformLine(newline) + "<br>" );
                lastverb = '';
                interjection_last = 1;
                return;
            }
            interjection_last = 0;

            // Detect Whisper Lines
            if (player == '<font') {
                // Remove spans, font tags from line then paste
                var newline = line.replace(/\n?<span.*?<\/span>/g, "");
                newline     = newline.replace(/<\/?font[^>]*>/g, "");

                var matches;
                // "You whisper to <b>...</b>: hi"
                // '<b>...</b> whispers: hello"
                if (matches = newline.match(/^You whisper to <b>(.*?)<\/b>: (.*)$/)) {
                    newline = '<span class="base0">-&gt; [</span><span class="red">msg/</span><span class="magenta">' + matches[1] + '</span><span class="base0">]</span> ' + matches[2];
                } else if (matches = newline.match(/^<b>(.*?)<\/b> whispers: (.*)$/)) {
                    newline = '<span class="base0">[</span><span class="magenta">' + matches[1] + '</span><span class="base0">]</span> ' + matches[2];
                }
                newelement.append('<br>' + newline);
                // We just did chat, we can't combine lines anymore
                lastverb = '';
                return;
            }

            // Detect Chat Lines
            if (player == '<span') {
                // Remove spans from lines then paste
                var newline = line.replace(/\n?<span.*?<\/span>/g, "");

                var matches;
                // <b>....:</b> hello
                if (matches = newline.match(/^<b>(.*?):<\/b> (.*)$/)) {
                    newline = '<span class="red">&lt;</span><span class="base02">' + matches[1] + '</span><span class="red">&gt;</span> ' + matches[2];
                }
                newelement.append('<br>' + newline);
                // We just did chat, we can't combine lines anymore
                lastverb = '';
                return;
            }

            // Make some changes to chat
            if (verb == "moves" && params.match(/^to the Buy phase/)) {
                return; //who cares?
            }
            if (verb == "refills" && params == "their bag") {
                verb = 'cycles';
                params = '';
            }
            if (verb == "starts" && params.match(/^their turn and antes/)) {
                verb = "antes";
                params = params.replace(/^their turn and antes /, "");
            }

            // Look for new players
            if (player != lastplayer) {
                newelement.append("<div class='player'>" + player + "</div>");
                newturn = 1;
                lastverb = '';
                if (start_flag == 1) { start_flag = 2; }
            }
            lastplayer = player;

            // General chat pasting
            if (verb == lastverb && verb != 'takes') {
                newelement.append("," + (params.length ? " " : "") + $.psChat.transformLine(params));
            } else if ((verb == "draws" && lastverb == "cycles") || (verb == "cycles" && lastverb == "draws")) {
                var nextline = verb + (params.length ? " " + params : "");
                newelement.append(", " + $.psChat.transformLine(nextline));
            } else {
                if (!newturn) {
                    newelement.append("<br>");
                }
                newelement.append(verb + (params.length ? " " : "") + $.psChat.transformLine(params));
            }

            lastverb = verb;
        });
        newelement.scrollTop(newelement[0].scrollHeight);
    }
};

window.setTimeout(function() {
    $.psChat.initalSetup();
    $.psChat.parseChat();

    // This is the dirtiest thing I've ever done.
    // Override Array.push so I can basically fire my own events when PSChat gets updated.
    unsafeWindow.Array.prototype.push = (function() {
        var original = Array.prototype.push;
        return function() {
            if (typeof arguments[arguments.length - 1] != 'undefined'
                && typeof arguments[arguments.length - 1].message   != 'undefined'
                && typeof arguments[arguments.length - 1].timestamp != 'undefined'
                && typeof arguments[arguments.length - 1].username  != 'undefined'
            ) {
                // Hmm.. probably a chat message.
                $("#divChat2").trigger("chatupdate");
            }
            return original.apply(this, arguments);
        };
    })();

    $("#divChat2").on("chatupdate", function(event) { $.psChat.parseChatDelay(); });

}, 10000);
/*
window.setInterval(function() {
    $.psChat.parseChat();
}, 2000);
*/
