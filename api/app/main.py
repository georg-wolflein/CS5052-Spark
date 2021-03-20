from fastapi import FastAPI, APIRouter
import typing
import logging

from __version__ import __version__
import data
from utils import dictify
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(title="Movie Backend API",
              version=__version__)
router = APIRouter(prefix="/api")


class Version(BaseModel):
    api: str


@router.get("/version",
            description="Obtain the API version.",
            response_model=Version)
def get_version():
    return {"api": __version__}


@router.get("/users/{user_id}/genres",
            description="Given a user, get the number of movies watched per genre.",
            response_model=typing.Dict[str, int])
@dictify
def search_user(user_id: int):
    return data.search_user(user_id).collect()


app.include_router(router)
