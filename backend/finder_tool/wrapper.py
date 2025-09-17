import asyncio
import json
import asyncpg
from dataclasses import dataclass, asdict
from typing import List
import os
from main import main as scraper_main
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

@dataclass
class Problem:
    problem: str
    score: int
    reason: str
    comment: str
    custom_id: str
    mission: str = ""
    competition: str = ""
    potential_customers: str = ""
    why_pay: str = ""
    mvp: str = ""
    finished_product: str = ""
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Problem':
        return cls(
            problem=data['problem'],
            score=data['score'],
            reason=data['reason'],
            comment=data['comment'],
            custom_id=data['custom_id'],
            mission=data.get('mission', ''),
            competition=data.get('competition', ''),
            potential_customers=data.get('potential_customers', ''),
            why_pay=data.get('why_pay', ''),
            mvp=data.get('mvp', ''),
            finished_product=data.get('finished_product', '')
        )

async def analyze_problem_with_openai(problem: Problem) -> Problem:
    """Analyze a problem using OpenAI API and enhance it with additional fields"""
    try:
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("OpenAI API key not found. Skipping analysis.")
            return problem
        
        client = OpenAI(api_key=api_key)
        
        prompt = f"""
            Given the following problem:

            Problem: {problem.problem}
            Reason: {problem.reason}
            Comment: {problem.comment}

            Please answer the following questions. 
            Return your response as a single, valid JSON object, with no explanation, no markdown, and no extra text. 
            Do not include any introductory or closing remarks. 
            Your response must be strictly valid JSON.

            Questions:
            - What is the Mission?
            - Does something like this already exist and who is the competition?
            - Who are potential customers and what are their benefits?
            - Why would they pay me?
            - How could the MVP look like?
            - How could the real app look like?

            Format your response exactly like this:

            {{
                "mission": "...",
                "competition": "...",
                "potential_customers": "...",
                "why_pay": "...",
                "mvp": "...",
                "finished_product": "..."
            }}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant analyzing business ideas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Extract the JSON response
        try:
            answer = response.choices[0].message.content
            # Find JSON part in the response
            start_idx = answer.find('{')
            end_idx = answer.rfind('}') + 1
            if start_idx >= 0 and end_idx > start_idx:
                json_str = answer[start_idx:end_idx]
                analysis = json.loads(json_str)
                
                # Update problem with analysis fields
                problem.mission = analysis.get("mission", "")
                problem.competition = analysis.get("competition", "")
                problem.potential_customers = analysis.get("potential_customers", "")
                problem.why_pay = analysis.get("why_pay", "")
                problem.mvp = analysis.get("mvp", "")
                problem.finished_product = analysis.get("finished_product", "")
            
        except Exception as e:
            print(f"Error parsing OpenAI response: {str(e)}")
            
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
    
    return problem

async def upload_problems_to_db(problems: List[Problem]) -> None:
    """Upload the problems to PostgreSQL database"""
    if not problems:
        print("No problems to upload")
        return
        
    try:
        # Get connection parameters from environment variables
        db_user = os.getenv('POSTGRES_USER', 'postgres')
        db_password = os.getenv('POSTGRES_PASSWORD', 'default_password')
        db_name = os.getenv('POSTGRES_DB', 'ideafinder')
        db_host = os.getenv('POSTGRES_HOST', 'localhost')
        
        # Connect to the database
        conn = await asyncpg.connect(
            user=db_user,
            password=db_password,
            database=db_name,
            host=db_host,
            port=5432
        )
        
        # Create table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS problems (
                id SERIAL PRIMARY KEY,
                problem TEXT NOT NULL,
                reason TEXT NOT NULL,
                mission TEXT,
                competition TEXT,
                potential_customers TEXT,
                why_pay TEXT,
                mvp TEXT,
                finished_product TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print(f"Uploading {len(problems)} problems to database")
        
        # Insert problems
        for problem in problems:
            await conn.execute("""
                INSERT INTO problems (
                    problem, reason, mission, competition, 
                    potential_customers, why_pay, mvp, finished_product
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """, 
            problem.problem, problem.reason,
            problem.mission, problem.competition, problem.potential_customers, 
            problem.why_pay, problem.mvp, problem.finished_product)
        
        await conn.close()
        print(f"Successfully uploaded {len(problems)} problems to database")
        
    except Exception as e:
        print(f"Error uploading to database: {str(e)}")

async def process_file(filename: str) -> None:
    """Process a single JSON file"""
    try:
        with open(filename, 'r', encoding='utf-8') as ideafile:
            data = json.load(ideafile)
            problems = [Problem.from_dict(item) for item in data]
            
            # Step 4: Analyze each problem with OpenAI
            enhanced_problems = []
            for problem in problems:
                enhanced_problem = await analyze_problem_with_openai(problem)
                enhanced_problems.append(enhanced_problem)
            
            print("Uploading problems to db")
            # Step 5: Upload enhanced problems to DB
            await upload_problems_to_db(enhanced_problems)
            
            # Clean up file after processing
            os.remove(filename)
            # print(f"Cleaned up file: {filename}")
            
    except Exception as e:
        print(f"Error processing file {filename}: {str(e)}")

# async def test_wrapper_main() -> None:
#     """Test function using hardcoded file"""
#     filename = 'high_potential_ideas_2025-08-27_16-24-44.json'
#     if os.path.exists(filename):
#         await process_file(filename)
#     else:
#         print(f"Test file {filename} not found")

async def wrapper_main() -> None:
    """Main wrapper function"""
    subreddits = ['https://www.reddit.com/r/Vent',
                  'https://www.reddit.com/r/Business_Ideas',
                  'https://www.reddit.com/r/Entrepreneur',
                  'https://www.reddit.com/r/microsaas',
                  'https://www.reddit.com/r/SaaS',
                  'https://www.reddit.com/r/SideProject',
                  'https://www.reddit.com/r/Startup_Ideas']

    while True:
        for subreddit in subreddits:
            print(f"Scraping for {subreddit}")
            # Step 1: Send batch request to scraper
            await scraper_main(subreddit, 1, 20, 30)
            
            print("Waiting for response")
            # Step 2: Get response and filename
            idea_filename = await scraper_main(subreddit, 2, 20, 30)

            # Step 3: Process the results file
            if idea_filename and os.path.exists(idea_filename):
                await process_file(idea_filename)
            else:
                print(f"No valid filename returned for {subreddit}")

        # Sleep for one week
        await asyncio.sleep(604800)

if __name__ == "__main__":
    asyncio.run(wrapper_main())