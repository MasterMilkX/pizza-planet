#!/bin/perl
use warnings;
use strict;

sub sort_names{
	#import
	open(my $FILE, "<", "places_and_people.txt") || die ("it's not there..");
	my @lines = <$FILE>;

	#convert
	my @names = ();
	foreach my $line (@lines){
		if($line =~/\t- [a-zA-Z]/){
			my $name = $line;
			$name =~s/\s+-\s//;
			push(@names, (split(' : ', $name))[0]);
		}
	}

	#sort
	@names = sort(@names);

	#output
	my $out = join("\n", @names);
	print("$out\n");
}

sort_names();