# geno_algo

One can start a python server with the following command to see the visualization.

```
python -m SimpleHTTPServer 8000
```
# TODO
1) Use KDTree to find neighbors
2) dockerfi this shit
4) Show optimal fish dna somewhere on the screen
5) Add button to reset poplation
6) Add ripple when reproduction happens
7) Tune reproduction (maybe add it as DNA)
8) Find better visually appealling way to show
9) Add basic noise to fish so they don't just sit at spawn
11) For KD testing, animating the tree would be nice to look at. Try to find a way to animate it
12) Put these todos as issues

# DONE

1) Fix edge bug where fishes favor edges; Fixed with todoiral distance
2) Extract genetic algorithm and generalize into its own file
3) Find reason for shaking in the fish. I migh have to smooth out some forces here and 
   there; due to forces hitting the max velocity. Overdoing accelerations and forces really
   just fucks up the smooth nature of the fishes

