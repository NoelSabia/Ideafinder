import time
from main import main

subreddits = ['https://www.reddit.com/r/Vent/', 
                '']

while(True):
    for subreddit in subreddits:
        main(subreddit, 1, 20, 30)
    time.sleep(604800)
