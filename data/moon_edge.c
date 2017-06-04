#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void spaceEdge(char *quadrant);
void moonEdge(char *quadrant, int size);

int main(int argc, char *argv[]){
	char *myQuad = argv[1];
	int map_size = atoi(argv[2]);
	spaceEdge(myQuad);
	//moonEdge(myQuad, map_size);

	return 0;
}

void spaceEdge(char *quadrant){
	printf("SPACE EDGE - %s\n---------------\n", quadrant);
	FILE *se;
	char *filename = malloc(strlen(quadrant) * sizeof(char));
	strcpy(filename, quadrant);

	if((se=fopen(strcat(filename, "_edge.txt"), "r")) == NULL){
		printf("Cannot find!\n");
		exit(-1);
	}
	int x, y;
	int i = 0;
	while(!feof(se)){
		fscanf(se, "%d, %d", &x, &y);
		printf("[%d, %d], ", x, y);
		i++;
		if(i == 4){
			printf("\n");
			i=0;
		}
	}
	fclose(se);
	printf("\n\n");

	free(filename);

}

void moonEdge(char *quadrant, int size){
	printf("MOON EDGE - %s\n---------------\n", quadrant);
	int i;
	int c = 0;
	int edgeH = 0;
	int edgeV = 0;
	if(strcmp(quadrant, "q1") == 0){
		edgeH = size-1;
		edgeV = 0;
	}else if(strcmp(quadrant, "q2") == 0){
		edgeH = size-1;
		edgeV = size-1;
	}else if(strcmp(quadrant, "q3") == 0){
		edgeH = 0;
		edgeV = size-1;
	}else if(strcmp(quadrant, "q4") == 0){
		edgeH = 0;
		edgeV = 0;
	}

	for(i=1;i<size;i++){
		printf("[%d, %d], ", edgeH, i);
		c++;
		if(c == 4){
			printf("\n");
			c = 0;
		}
	}
	for(i=1;i<size;i++){
		printf("[%d, %d], ", i, edgeV);
		c++;
		if(c == 4){
			printf("\n");
			c = 0;
		}
	}

	printf("\n\n");
}
