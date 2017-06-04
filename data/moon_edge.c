#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]){
	FILE *mp;
	char *filename = argv[1];

	if((mp=fopen(argv[1], "r")) == NULL){
		printf("Cannot find!\n");
	}

	int x, y;
	int i = 0;
	while(!feof(mp)){
		fscanf(mp, "%d, %d", &x, &y);
		printf("[%d, %d], ", x, y);
		i++;
		if(i == 4){
			printf("\n");
			i=0;
		}
	}
	fclose(mp);
	printf("\n");

	return 0;
}