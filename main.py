from selenium import webdriver
import time
import json
from datetime import datetime
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv

load_dotenv()

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

class Ideafinder:
    def __init__(self, url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape, browser_needed):
        if browser_needed != False:
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
    
    def summarizePost(self, post_content: str) -> str:
        """Summarize post content using OpenAI API"""
        try:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                print(f"{YELLOW}No API key found, using original post content{RESET}")
                return post_content
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that summarizes text as concisely as possible while retaining key information."},
                    {"role": "user", "content": f"Summarize this post in 2-3 sentences, focusing on the main topic and key points:\n\n{post_content}"}
                ],
                "max_tokens": 1500
            }
            
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            
            if response.status_code == 200:
                summary = response.json()["choices"][0]["message"]["content"].strip()
                print(f"{GREEN}Post summarized successfully{RESET}")
                return summary
            else:
                print(f"{YELLOW}Failed to summarize post, using original content{RESET}")
                return post_content
                
        except Exception as e:
            print(f"{YELLOW}Error summarizing post: {e}, using original content{RESET}")
            return post_content
    
    def createJsonL(self, ankerlist: list) -> None:
        filename = datetime.now().strftime("batch_%Y-%m-%d_%H-%M-%S.jsonl")
        self.jsonl_name = filename
        print(f"{GREEN}Saving comments to {filename}{RESET}")
        with open(filename, "w", encoding="utf-8") as f:
            custom_id_counter = 1
            for idx, link in enumerate(ankerlist):
                print(f"{GREEN}Current index at: [{idx+1}/{len(ankerlist)}]{RESET}")
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
                        
                        if post_content.strip():
                            post_content = self.summarizePost(post_content)
                        
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
                                "Use only the comment and the post for context. Output one problem the user has that a small paid app could solve, or NO_PROBLEM. Then a numeric score 0–100 and one short reason. Format: PROBLEM=<...>|SCORE=<n>|REASON=<...>"
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
            # Step 1: Upload the file first
            files_url = "https://api.openai.com/v1/files"
            file_upload_headers = {
                "Authorization": f"Bearer {api_key}"
            }
            
            with open(self.jsonl_name, 'rb') as file:
                files = {
                    'file': (self.jsonl_name, file),
                    'purpose': (None, 'batch')
                }
                
                print(f"\n{YELLOW}Uploading file for batch processing...{RESET}")
                upload_response = requests.post(files_url, headers=file_upload_headers, files=files)
                
                if upload_response.status_code != 200:
                    print(f"{RED}File upload failed. Status code: {upload_response.status_code}{RESET}")
                    print(f"{RED}Response: {upload_response.text}{RESET}")
                    return
                    
                file_id = upload_response.json().get("id")
                print(f"{GREEN}File uploaded successfully. File ID: {file_id}{RESET}")
            
            # Step 2: Create batch with the file ID
            batch_url = "https://api.openai.com/v1/batches"
            batch_headers = {
                "Authorization": f"Bearer {api_key}",
                "OpenAI-Beta": "batch/v1",
                "Content-Type": "application/json"
            }
            
            payload = {
                "input_file_id": file_id,
                "endpoint": "/v1/chat/completions",
                "completion_window": "24h",  # Required: time window for batch completion
                "metadata": {
                    "batch_name": f"ideafinder_batch_{datetime.now().strftime('%Y%m%d')}"
                }
            }
            
            print(f"\n{YELLOW}Creating batch with uploaded file...{RESET}")
            response = requests.post(batch_url, headers=batch_headers, json=payload)
            
            if response.status_code == 200:
                batch_id = response.json().get("id")
                print(f"{GREEN}Batch request sent successfully. Batch ID: {batch_id}{RESET}")
                
                with open("batch_id.txt", "w") as bid_file:
                    bid_file.write(batch_id)
                print(f"{GREEN}Batch ID saved to batch_id.txt{RESET}")
            else:
                print(f"{RED}Batch request failed. Status code: {response.status_code}{RESET}")
                print(f"{RED}Response: {response.text}{RESET}")
                
        except Exception as e:
            print(f"{RED}Error sending batch request: {e}{RESET}")
    
    def cleanResults(self, results_filename) -> None:

    
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
        
        print(f"\n{YELLOW}Checking status for batch ID: {batch_id}{RESET}\n")
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print(f"{RED}OPENAI_API_KEY environment variable not found.{RESET}")
            return
            
        headers = {
            "Authorization": f"Bearer {api_key}",
            "OpenAI-Beta": "batch/v1"
        }
        
        status_url = f"https://api.openai.com/v1/batches/{batch_id}"
        max_attempts = 2880 # 30 seconds delay inbetween for 24 hours
        
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
                    print(f"{GREEN}Batch processing completed! Downloading results...{RESET}")
                    
                    # Get batch details to find the output_file_id
                    batch_details = status_data
                    output_file_id = batch_details.get("output_file_id")
                    
                    if not output_file_id:
                        print(f"{RED}No output file ID found in batch details{RESET}")
                        return
                    
                    # Download the actual file content directly using the output_file_id
                    file_content_url = f"https://api.openai.com/v1/files/{output_file_id}/content"
                    file_headers = {
                        "Authorization": f"Bearer {api_key}"
                    }
                    
                    content_response = requests.get(file_content_url, headers=file_headers)
                    if content_response.status_code == 200:
                        results_filename = f"results_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jsonl"
                        with open(results_filename, "wb") as f:
                            f.write(content_response.content)
                        print(f"{GREEN}Results downloaded to {results_filename}{RESET}")
                        return results_filename
                    else:
                        print(f"{RED}Error downloading file content: {content_response.status_code} - {content_response.text}{RESET}")
                        return
                    self.cleanResults(results_filename)
                elif status == "failed" or status == "cancelled":
                    print(f"{RED}Batch processing {status}!{RESET}")
                    return
            
                time.sleep(30)

            except Exception as e:
                print(f"\n{RED}Exception thrown while retrieving batch: {e}{RESET}")
            
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
        choice = int(input(f"{GREEN}What do you want to do:\n1. Scrape\n2. Get Batch results{RESET}\n{YELLOW}Input: {RESET}"))       
        match choice:
            case 1:
                url_to_scrape = input(f"\n{YELLOW}URL to scrape: {RESET}")
                
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
                
                finder = Ideafinder(url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape, True)
                finder.orchastrateIdeafinder()
            case 2:
                finder = Ideafinder("", "", "", False)
                finder.retrieveBatchResults()
            case 3:
                finder = Ideafinder("", "", "", False)
                finder.cleanResults()
            case _:
                print(f"\n{RED}Invalid input! Program stopped.{RESET}\n")
    except Exception as e:
        print(f"\n{RED}Uncaugt error in main function: {e}{RESET}\n")

if __name__ == "__main__":
    main()

