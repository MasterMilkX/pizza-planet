function song(name,view,off=0){
	this.midiURL = "music/midi/" + name + ".midi";
	this.mp3URL = "music/mp3/" + name + ".mp3";

	this.tickOff = off;

	this.view = view;
}

var songlist = [
	new song("title_and_registration","duet",800),
	new song("black_sheep","band",1750),
	new song("when_i_come_around", "duet"),
	new song("another_girl_another_planet","band",2000)
];