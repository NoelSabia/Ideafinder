from selenium import webdriver
import time
import json
from datetime import datetime
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv
import sys

load_dotenv()

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

class Ideafinder:
    def __init__(self, url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape, browser_needed):
        if browser_needed != False:
            # Add options for headless mode
            from selenium.webdriver.chrome.options import Options
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            # Set user agent to avoid detection
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")
            
            self.driver = webdriver.Chrome(options=chrome_options)
        self.url_to_scrape = url_to_scrape
        self.how_many_posts_to_scrape = how_many_posts_to_scrape
        self.how_many_comments_to_scrape = how_many_comments_to_scrape
        self.jsonl_name = ""
        self.resultsFilename = ""
    
    def getAnkers(self) -> list:
        """
        This functions get <a> from the reddit site for the posts

        :return: list of <a>
        """
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
        """
        Summarize post content using OpenAI API

        :param p1: the hole post as a string
        :return: shortened post as a string
        """
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
                "model": "gpt-4.1-mini",
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
        """
        Creates a JSONL file

        :param p1: list of <a>
        """
        filename = datetime.now().strftime("batch_%Y-%m-%d_%H-%M-%S.jsonl")
        batchlink_filename = datetime.now().strftime("batchlink_%Y-%m-%d_%H-%M-%S.jsonl")
        
        self.jsonl_name = filename
        print(f"{GREEN}Saving comments to {filename}{RESET}")
        print(f"{GREEN}Saving batch links to {batchlink_filename}{RESET}")
        
        with open(filename, "w", encoding="utf-8") as f, open(batchlink_filename, "w", encoding="utf-8") as link_f:
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
                                f"POST:\n{post_content}\n\nCOMMENT:\n{comment_text}\n\n"
                                "TASK: Evaluate the COMMENT only. Do not use the POST to invent problems or context.\n\n"
                                "Step 1: Determine if the COMMENT describes a problem that can realistically be addressed by software (SaaS, automation tool, or app).  \n"
                                "- Valid SaaS problems usually involve: tracking, monitoring, organizing, automating, analyzing, alerting, aggregating, verifying, communicating, or coordinating information or workflows.  \n"
                                "- If the problem is purely about emotions, motivation, education, strategy, trust in people, or physical-world issues (e.g. suppliers cheating, lifestyle choices), it is NOT SaaS-solvable.  \n\n"
                                "If the comment is irrelevant, vague, generic, off-topic, or describes a non-software-solvable issue, output:  \n"
                                "PROBLEM=NONE|COMMENT=<comment_text>|SCORE=0|REASON=Comment is useless for SaaS.  \n\n"
                                "Step 2: If the COMMENT does describe a SaaS-solvable problem, extract ONE clear and actionable problem and assign a score using these rules:  \n"
                                "+40 if the comment describes a concrete and specific SaaS-solvable workflow problem.  \n"
                                "+20 if the problem seems recurring or frequent for many users.  \n"
                                "+20 if the problem implies measurable pain (time wasted, money lost, effort required).  \n"
                                "+10 if the comment suggests a clear target user who has the problem.  \n"
                                "+10 if the problem is unique or specific enough for a differentiated SaaS product.  \n\n"
                                "Output only in this format:  \n"
                                "PROBLEM=<...>|COMMENT=<...>|SCORE=<n>|REASON=<...>"
                            )
                            
                            # Write API request to batch file
                            json_obj = {
                                "custom_id": f"request-{custom_id_counter}",
                                "method": "POST",
                                "url": "/v1/chat/completions",
                                "body": {
                                    "model": "gpt-4.1-mini",
                                    "messages": [
                                        {"role": "system", "content": "You are an assistant to help me evaluate business ideas."},
                                        {"role": "user", "content": combined_text}
                                    ],
                                    "max_tokens": 1000
                                }
                            }
                            f.write(json.dumps(json_obj) + "\n")
                            
                            # Write link mapping to batchlink file
                            link_obj = {
                                "custom_id": f"request-{custom_id_counter}",
                                "link": link
                            }
                            link_f.write(json.dumps(link_obj) + "\n")
                            
                            custom_id_counter += 1
                        except Exception as e:
                            print(f"{RED}Error extracting <p> from comment div: {e}{RESET}")
                            continue
                except Exception as e:
                    print(f"{RED}Error extracting content from {link}: {e}{RESET}")
                    continue

    def sendBatchApiRequest(self) -> None:
        """
        Sends all the requests as batches to make it 50% cheaper
        """
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
    
    def cleanResults(self, results_filename=None) -> None:
        """
        Process batch results, filtering for scores >= 85 and extracting key information.
        """
        
        # If no results_filename provided, ask user to provide it
        if not results_filename:
            results_filename = input(f"\n{YELLOW}Enter the results JSONL filename to process: {RESET}")
        
        if not os.path.exists(results_filename):
            print(f"{RED}File {results_filename} not found.{RESET}")
            return
        
        print(f"\n{YELLOW}Processing batch results from {results_filename}...{RESET}")
        
        high_potential_ideas = []
        
        try:
            # Read and process each line in the results file
            with open(results_filename, 'r', encoding='utf-8') as file:
                line_count = 0
                high_score_count = 0
                all_score_count = 0
                
                for line in file:
                    line_count += 1
                    try:
                        # Parse the JSONL line
                        result = json.loads(line)
                        
                        # Extract the assistant's content from the response
                        if 'response' in result and 'body' in result['response']:
                            content = result['response']['body']['choices'][0]['message']['content']
                            print(f"{YELLOW}Processing line {line_count}...{RESET}")
                            
                            # Parse the formatted response (PROBLEM=X|COMMENT=Y|SCORE=Z|REASON=W)
                            parts = content.split('|')
                            if len(parts) >= 3:  # Changed from == 3 to >= 3 to handle 4 parts
                                # Find the parts by prefix rather than position
                                problem_part = next((p for p in parts if p.strip().startswith('PROBLEM=')), "")
                                score_part = next((p for p in parts if p.strip().startswith('SCORE=')), "")
                                reason_part = next((p for p in parts if p.strip().startswith('REASON=')), "")
                                comment_part = next((p for p in parts if p.strip().startswith('COMMENT=')), "")
                                
                                # Extract the score
                                score = 0
                                if score_part:
                                    try:
                                        score = int(score_part.strip()[6:])
                                        all_score_count += 1
                                        print(f"{GREEN}Found score: {score}{RESET}")
                                    except ValueError:
                                        print(f"{YELLOW}Invalid score format in line {line_count}: {score_part}{RESET}")
                                
                                if score >= 85:
                                    high_score_count += 1
                                    problem = problem_part[8:] if problem_part.startswith('PROBLEM=') else problem_part
                                    reason = reason_part[7:] if reason_part.startswith('REASON=') else reason_part
                                    high_potential_ideas.append({
                                        "problem": problem,
                                        "score": score,
                                        "reason": reason,
                                        "comment": comment_part[8:] if comment_part.startswith('COMMENT=') else comment_part,
                                        "custom_id": result.get("custom_id", "")
                                    })
                            else:
                                print(f"{YELLOW}Response format doesn't match expected pattern in line {line_count}. Found {len(parts)} parts.{RESET}")
                
                    except json.JSONDecodeError:
                        print(f"{YELLOW}Invalid JSON in line {line_count}{RESET}")
                    except Exception as e:
                        print(f"{YELLOW}Error processing line {line_count}: {e}{RESET}")
        
            print(f"\n{GREEN}Found {all_score_count} scores in total{RESET}")
            
            # If no high scores but we have ideas, reduce the threshold
            if high_score_count == 0 and all_score_count > 0:
                print(f"{YELLOW}No ideas with score >= 85 found. Lowering threshold to 80...{RESET}")
                
                # Re-process the file with lower threshold
                with open(results_filename, 'r', encoding='utf-8') as file:
                    for line in file:
                        try:
                            result = json.loads(line)
                            if 'response' in result and 'body' in result['response']:
                                content = result['response']['body']['choices'][0]['message']['content']
                                parts = content.split('|')
                                
                                problem_part = next((p for p in parts if p.strip().startswith('PROBLEM=')), "")
                                score_part = next((p for p in parts if p.strip().startswith('SCORE=')), "")
                                reason_part = next((p for p in parts if p.strip().startswith('REASON=')), "")
                                comment_part = next((p for p in parts if p.strip().startswith('COMMENT=')), "")
                                
                                if score_part:
                                    try:
                                        score = int(score_part.strip()[6:])
                                        if score >= 80:  # Lower threshold to 80
                                            high_score_count += 1
                                            problem = problem_part[8:] if problem_part.startswith('PROBLEM=') else problem_part
                                            reason = reason_part[7:] if reason_part.startswith('REASON=') else reason_part
                                            high_potential_ideas.append({
                                                "problem": problem,
                                                "score": score,
                                                "reason": reason,
                                                "comment": comment_part[8:] if comment_part.startswith('COMMENT=') else comment_part,
                                                "custom_id": result.get("custom_id", "")
                                            })
                                    except ValueError:
                                        pass
                        except:
                            pass
            
            if high_potential_ideas:
                output_filename = f"high_potential_ideas_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.json"
                with open(output_filename, 'w', encoding='utf-8') as outfile:
                    json.dump(high_potential_ideas, outfile, indent=2)
                
                threshold = 80 if high_score_count == 0 and all_score_count > 0 else 85
                print(f"\n{GREEN}Found {len(high_potential_ideas)} high-scoring ideas (score >= {threshold}) out of {line_count} total.{RESET}")
                print(f"{GREEN}Filtered results saved to {output_filename}{RESET}")
            else:
                print(f"\n{YELLOW}No high-scoring ideas found in {line_count} results.{RESET}")
        
        except Exception as e:
            print(f"{RED}Error processing results file: {e}{RESET}")

    
    def retrieveBatchResults(self, batch_id=None) -> None:
        """
        Fetches the results from the finished batch

        :param p1: batch id
        """
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
                        self.resultsFilename = results_filename
                        with open(results_filename, "wb") as f:
                            f.write(content_response.content)
                        print(f"{GREEN}Results downloaded to {results_filename}{RESET}")
                        self.cleanResults(results_filename)
                        return results_filename
                    else:
                        print(f"{RED}Error downloading file content: {content_response.status_code} - {content_response.text}{RESET}")
                        return
                elif status == "failed" or status == "cancelled":
                    print(f"{RED}Batch processing {status}!{RESET}")
                    return
            
                time.sleep(30)

            except Exception as e:
                print(f"\n{RED}Exception thrown while retrieving batch: {e}{RESET}")
            
        print(f"{YELLOW}Reached maximum polling attempts. Check status manually with:{RESET}")
        print(f"curl https://api.openai.com/v1/batches/{batch_id} -H \"Authorization: Bearer $OPENAI_API_KEY\" -H \"OpenAI-Beta: batch/v1\"")
    
    def getFilenameOfHighscoringIdeas(self) -> str:
        return self.resultsFilename
    
    def orchastrateIdeafinder(self) -> None:
        """
        This function is just to organize
        """
        print(f"\n{YELLOW}Scraping Ankers.{RESET}")
        ankerlist = self.getAnkers()
        print(f"\n{YELLOW}Creating JsonL with Comments{RESET}")
        self.createJsonL(ankerlist)
        print(f"\n{YELLOW}Start batch api request{RESET}")
        self.sendBatchApiRequest()

def main(subreddit_url, choice, post_to_scrape, comments_per_post_to_scrape) -> str:
    try:
        choice = choice
        
        if choice == 1:
            # For scraping Reddit
            if subreddit_url != "":
                url_to_scrape = subreddit_url
            else:
                url_to_scrape = input(f"\n{YELLOW}URL to scrape: {RESET}")
            
            how_many_posts_to_scrape = 20
            try:
                how_many_posts_to_scrape = int(post_to_scrape)
            except ValueError:
                print(f"{YELLOW}Invalid posts count, using default 20{RESET}")
            
            how_many_comments_to_scrape = 30
            try:
                how_many_comments_to_scrape = int(comments_per_post_to_scrape)
            except ValueError:
                print(f"{YELLOW}Invalid comments count, using default 30{RESET}")
            
            finder = Ideafinder(url_to_scrape, how_many_posts_to_scrape, how_many_comments_to_scrape, True)
            finder.orchastrateIdeafinder()
            return (finder.getFilenameOfHighscoringIdeas)
            
        elif choice == 2:
            # For retrieving batch results
            finder = Ideafinder("", "", "", False)
            finder.retrieveBatchResults()
            
        else:
            print(f"\n{RED}Invalid choice! Use 1 for scraping or 2 for retrieving results.{RESET}")
            
    except Exception as e:
        print(f"\n{RED}Uncaught error in main function: {e}{RESET}\n")
    

# if __name__ == "__main__":
#     main("https://www.reddit.com/r/Vent/", 1, 20, 30)

# if __name__ == "__main__":
#     main("https://www.reddit.com/r/Vent/", 2, 20, 30)
