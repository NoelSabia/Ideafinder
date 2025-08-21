from selenium import webdriver
import time
import json
from datetime import datetime
from openai import OpenAI
import os
import requests

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

class Ideafinder:
    def __init__(self, url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape):
        self.driver = webdriver.Chrome()
        self.url_to_scrape = url_to_scrape
        self.how_many_posts_to_scrape = how_many_posts_to_scrape
        self.how_many_comments_to_scrape = how_many_comments_to_scrape
        self.jsonl_name = ""
    
    def getAnkers(self) -> list:
        self.driver.get(self.url_to_scrape)
        hrefs = set()
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while len(hrefs) < self.how_many_posts_to_scrape:
            anchors = self.driver.find_elements("xpath", '//a[@slot="full-post-link"]')
            for a in anchors:
                href = a.get_attribute("href")
                if href:
                    hrefs.add(href)
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
        hrefs_list = list(hrefs)[:self.how_many_posts_to_scrape]
        print(f"{GREEN}Extracted {len(hrefs_list)} links ready to scrape.{RESET}")
        return hrefs_list
    
    def createJsonL(self, ankerlist: list) -> None:
        filename = datetime.now().strftime("batch_%Y-%m-%d_%H-%M-%S.jsonl")
        self.jsonl_name = filename
        print(f"\n{GREEN}Saving comments to {filename}{RESET}")
        with open(filename, "w", encoding="utf-8") as f:
            custom_id_counter = 1
            for idx, link in enumerate(ankerlist):
                print(f"\n{GREEN}Current index at: [{idx+1}/{len(ankerlist)}]{RESET}")
                try:
                    self.driver.get(link)
                    time.sleep(3)
                except Exception as e:
                    print(f"{RED}Error loading {link}: {e}{RESET}")
                    continue
                
                try:
                    post_content = ""
                    try:
                        post_div = self.driver.find_element("xpath", '//div[contains(@id, "-post-rtjson-content")]')
                        p_tags = post_div.find_elements("tag name", "p")
                        post_paragraphs = [p.text for p in p_tags]
                        post_content = "\n\n".join(post_paragraphs)
                        print(f"{GREEN}Extracted post content with {len(post_paragraphs)} paragraphs{RESET}")
                    except Exception as e:
                        print(f"{RED}Error extracting post content: {e}{RESET}")
                    
                    comment_divs = self.driver.find_elements("xpath", '//div[@slot="comment"]')
                    print(f"{GREEN}Found {len(comment_divs)} comment divs{RESET}")
                    
                    for div in comment_divs[:self.how_many_comments_to_scrape]:
                        try:
                            p = div.find_element("tag name", "p")
                            comment_text = p.text
                            
                            combined_text = (
                                f"POST:\n{post_content}\n\nCOMMENT:\n{comment_text}\n"
                                "TASK:\nIdentify a specific, actionable problem mentioned in the comment that could be solved with a small software product to make money. Focus on precise issues, not general topics. Use the post only as context. "
                                "Additionally, rate from 0 to 100 how well the comment provides such a problem, where 0 means no relevant problem and 100 means a perfectly described, actionable problem."
                            )
                            
                            json_obj = {
                                "custom_id": f"request-{custom_id_counter}",
                                "method": "POST",
                                "url": "/v1/chat/completions",
                                "body": {
                                    "model": "gpt-4o-mini",
                                    "messages": [
                                        {"role": "system", "content": "You are an assistant to help me evaluate business ideas."},
                                        {"role": "user", "content": combined_text}
                                    ],
                                    "max_tokens": 1000
                                }
                            }
                            f.write(json.dumps(json_obj) + "\n")
                            custom_id_counter += 1
                        except Exception as e:
                            print(f"{RED}Error extracting <p> from comment div: {e}{RESET}")
                            continue
                except Exception as e:
                    print(f"{RED}Error extracting content from {link}: {e}{RESET}")
                    continue

    def sendBatchApiRequest(self) -> None:
        if not self.jsonl_name:
            print(f"{RED}No batch file name available.{RESET}")
            return
        
        print(f"{GREEN}Using batch file: {self.jsonl_name}{RESET}")
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print(f"{RED}OPENAI_API_KEY environment variable not found.{RESET}")
            return
        
        try:
            with open(self.jsonl_name, 'rb') as f:
                batch_url = "https://api.openai.com/v1/batches"
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "OpenAI-Beta": "batch/v1"
                }

                files = {
                    'file': (self.jsonl_name, f)
                }
                
                data = {
                    "purpose": "batch"
                }
                
                print(f"{YELLOW}Sending batch request...{RESET}")
                response = requests.post(batch_url, headers=headers, files=files, data=data)
                
                if response.status_code == 200:
                    batch_id = response.json().get("id")
                    print(f"{GREEN}Batch request sent successfully. Batch ID: {batch_id}{RESET}")
                    
                    with open("batch_id.txt", "w") as bid_file:
                        bid_file.write(batch_id)
                    print(f"{GREEN}Batch ID saved to batch_id.txt{RESET}")
                    
                    print(f"\n{YELLOW}To check batch status:{RESET}")
                    print(f"curl https://api.openai.com/v1/batches/{batch_id} -H \"Authorization: Bearer $OPENAI_API_KEY\" -H \"OpenAI-Beta: batch/v1\"")
                    
                    print(f"\n{YELLOW}To retrieve results when complete:{RESET}")
                    print(f"curl https://api.openai.com/v1/batches/{batch_id}/output -H \"Authorization: Bearer $OPENAI_API_KEY\" -H \"OpenAI-Beta: batch/v1\" --output results.jsonl")
                else:
                    print(f"{RED}Batch request failed. Status code: {response.status_code}{RESET}")
                    print(f"{RED}Response: {response.text}{RESET}")
                    
        except Exception as e:
            print(f"{RED}Error sending batch request: {e}{RESET}")
    
    def retrieveBatchResults(self, batch_id=None):
        import time
        
        # If no batch_id provided, try to load from file
        if not batch_id:
            try:
                with open("batch_id.txt", "r") as f:
                    batch_id = f.read().strip()
            except:
                print(f"{RED}No batch_id provided and couldn't read batch_id.txt{RESET}")
                return
        
        print(f"{YELLOW}Checking status for batch ID: {batch_id}{RESET}")
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print(f"{RED}OPENAI_API_KEY environment variable not found.{RESET}")
            return
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "OpenAI-Beta": "batch/v1"
        }
        
        # Poll status until complete
        status_url = f"https://api.openai.com/v1/batches/{batch_id}"
        max_attempts = 60  # 30 minutes with 30-second interval
        
        for attempt in range(max_attempts):
            try:
                response = requests.get(status_url, headers=headers)
                if response.status_code != 200:
                    print(f"{RED}Error checking batch status: {response.status_code} - {response.text}{RESET}")
                    return
                
                status_data = response.json()
                status = status_data.get("status")
                
                print(f"{YELLOW}Batch status: {status} (Attempt {attempt+1}/{max_attempts}){RESET}")
                
                if status == "completed":
                    # Download results
                    print(f"{GREEN}Batch processing completed! Downloading results...{RESET}")
                    output_url = f"https://api.openai.com/v1/batches/{batch_id}/output"
                    
                    download_response = requests.get(output_url, headers=headers)
                    if download_response.status_code == 200:
                        results_filename = f"results_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jsonl"
                        with open(results_filename, "wb") as f:
                            f.write(download_response.content)
                        print(f"{GREEN}Results downloaded to {results_filename}{RESET}")
                        return results_filename
                    else:
                        print(f"{RED}Error downloading results: {download_response.status_code} - {download_response.text}{RESET}")
                        return
                elif status == "failed" or status == "cancelled":
                    print(f"{RED}Batch processing {status}!{RESET}")
                    return
                
                # Wait before checking again
                time.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                print(f"{RED}Error during batch status check: {e}{RESET}")
                return
                
        print(f"{YELLOW}Reached maximum polling attempts. Check status manually with:{RESET}")
        print(f"curl https://api.openai.com/v1/batches/{batch_id} -H \"Authorization: Bearer $OPENAI_API_KEY\" -H \"OpenAI-Beta: batch/v1\"")
    
    def orchastrateIdeafinder(self) -> None:
        print(f"\n{YELLOW}Scraping Ankers.{RESET}")
        ankerlist = self.getAnkers()
        print(f"\n{YELLOW}Creating JsonL with Comments{RESET}")
        self.createJsonL(ankerlist)
        print(f"\n{YELLOW}Start batch api request{RESET}")
        self.sendBatchApiRequest()

def main():
    try:
        url_to_scrape = input(f"{YELLOW}URL to scrape: {RESET}")
        
        how_many_posts_to_scrape = input(f"\n{YELLOW}How many posts should be scraped (default 20): {RESET}")
        try:
            how_many_posts_to_scrape = int(how_many_posts_to_scrape)
        except:
            print(f"{RED}Couldn't convert posts to scrape, going to default 20{RESET}")
            how_many_posts_to_scrape = 20

        how_many_comments_to_scrape = input(f"\n{YELLOW}How many comments should be scraped (default 30): {RESET}")
        try:
            how_many_comments_to_scrape = int(how_many_comments_to_scrape)
        except:
            print(f"{RED}Couldn't convert comments to scrape, going to default 30{RESET}")
            how_many_comments_to_scrape = 30
        
        finder = Ideafinder(url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape)
        finder.orchastrateIdeafinder()
    except Exception as e:
        print(f"\n{RED}Uncaugt error in main function: {e}{RESET}\n")

if __name__ == "__main__":
    main()

