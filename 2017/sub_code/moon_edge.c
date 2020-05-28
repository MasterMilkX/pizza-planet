#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int countLines();
void getQ2(int *set[], int num);
void spaceEdge(int *set[], char *quadrant, int pts, int size);

int main(int argc, char *argv[]){
	char *myQuad = argv[1];
	int map_size = atoi(argv[2]);
	int points = countLines();

	int i;
	int *edges[points];
	for(i=0;i<points;i++){
		edges[i] = malloc(2*sizeof(int));
	}
	getQ2(edges, points);
	spaceEdge(edges, myQuad, points, map_size);

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

// COUNTS THE NUMBER OF LINES IN A FILE
int countLines(){
	FILE *fp;
	long ct = 0;
	if((fp = fopen("q2_edge.txt", "r")) == NULL){
		printf("CANNOT FIND!\n");
		exit(0);
	}
	char c;
	for(c = getc(fp);c != EOF; c = getc(fp)){
		if(c == '\n')
			ct++;
	}
	fclose(fp);
	return ct;
}


void spaceEdge(int *set[], char *quadrant, int pts, int size){
	printf("SPACE EDGE - %s\n---------------\n", quadrant);
	int ax, ay;
	int i = 0;

	if(strcmp(quadrant, "q1") == 0){
		ax = size-1;
		ay = 0;
	}else if(strcmp(quadrant, "q2") == 0){
		ax = 0;
		ay = 0;
	}else if(strcmp(quadrant, "q3") == 0){
		ax = 0;
		ay = size-1;
	}else if(strcmp(quadrant, "q4") == 0){
		ax = size-1;
		ay = size-1;
	}

	for(i=0;i<pts;i++){
		int edge[2];
		memcpy(edge, set[i], 2*sizeof(int));
		printf("[%d, %d], ", abs(ax-edge[0]), abs(ay-edge[1]));
		if(i%4 == 3){
			printf("\n");
		}
	}
	printf("\n\n");

}
