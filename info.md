info.md




How to connect:

Go to http://ctfmvp.herokuapp.com/ (url subject to change) to play the game via the internet. 
Go to http://127.0.0.1:1337 to play the game on the local network (make sure that the server is running - index.js is the primary server file to run using node).




How to play the game:

There are two teams: red and blue.
Run to the flag to pick it up. Picking up the flag will slow you down.
Score by bringing the flag back to your own base.
Bump into an enemy player with the flag to knock the flag down.
The flag cannot be picked up for two seconds after it gets knocked down.
When a player scores, the flag gets put into a random vertical position in the middle of the map.
The first team to 10 points wins, and then the scores, flag position, and player positions will reset.




Matchmaking:

Players will go into the first located room with an open player slot, or a new room if every existing room is full.
Maximum of 10 players per room.




Technologies used:

HTML5 Canvas: for rendering the game.
Socket IO: for client/server communication.




Possible improvements/additions:

-better room id numbering system rather than just incrementing
-have server do all of the collision and score checking or atleast have it do verification to prevent against "hacking/cheating"
-more efficient ways to find a room with an open player slot
-real matchmaking
-database to allow users to login and keep track of their scores/stats
-more efficient ways to put new players on the map
-handle lag/latency/sync issues
-additional game features or even an entirely new game using provided code infrastructure
-game lobby
-game chat system



