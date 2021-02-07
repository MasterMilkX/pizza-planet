var MidiPlayer = require('midi-player-js');
 
// Initialize player and register event handler
var Player = new MidiPlayer.Player(function(event) {
    console.log(event);
});
 
// Load a MIDI file
Player.loadFile('../music/midi/title_and_registration_ash_and_nat.midi');
Player.play();