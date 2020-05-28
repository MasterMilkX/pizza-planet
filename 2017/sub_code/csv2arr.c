#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]){
	char *myfile = argv[1];

	int i;
	FILE *se;
	if((se=fopen(myfile, "r")) == NULL){
		printf("Cannot find!\n");
		exit(-1);
	}

	char str[100];
	while(!feof(se)){
		printf("[");
		fscanf(se, "%s", str);
		printf("%s", str);
		printf("],\n");
	}
	fclose(se);

	return 0;
}

void getQ2(int *set[], int num){
	FILE *se;
	if((se=fopen("q2_edge.txt", "r")) == NULL){
		printf("Cannot find!\n");
		exit(-1);
	}
	int x, y;
	int i = 0;
	int pair[2];
	while(i < num){
		fscanf(se, "%d, %d", &x, &y);
		pair[0] = x;
		pair[1] = y;
		memcpy(set[i], pair, 2*sizeof(int));
		i++;
	}
	fclose(se);
}
