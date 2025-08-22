# Ideafinder
Proof of concept: Scraper in combination with AI to find and score ideas from reddit.

## Table of contents
- [How to install and start](#how-to-install-and-start)
- [How it works under the hood](#how-it-works-under-the-hood)

### How to install and start
1. Create and start the virtual env with
```bash
    python3 -m venv ./.venv &&\
    source ./.venv/bin/active
```
2. Install the requirements with
```bash
    pip install -r requirements.txt
```
3. Create a .env and put your API KEY in there
```bash
    touch .env &&\
    echo "OPENAI_API_KEY='<YOUR_API_KEY>'" > .env
```
4. Start program with
```bash
    python3 main.py
```

### How it works under the hood
This program uses a scraper (selenium) to get the top 100 posts (default) of a subreddit.
It then sorts it in jsonl files to be ready as a batch for openais api.
After that the batch will be finished in the next 24 hours and the answers returned.
In the end the best 10 things will be returned in a nice structured file.
