import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import status

# Logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)-15s - %(levelname)-8s - %(message)s'
)
logger = logging.getLogger(__name__)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # TODO: change origins to actual frontend domain
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health() -> JSONResponse:
    """
    Checks the health of the api

    r: returns a JSON with the Response. 200 if everything is okay
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"health": "healthy :)"}
    )

[
    {
        status_code: 200,
        content: {
            "heatlty": "yes we are healty",
        }
    }
]