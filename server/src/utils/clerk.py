import os
from clerk_backend_api import Clerk

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

clerk_client = Clerk(bearer_auth=f'{CLERK_SECRET_KEY}')

def get_clerk_user_from_session(session_id):
    session = clerk_client.sessions.get(session_id=session_id)
    user = clerk_client.users.get(user_id=session.user_id)
    return user
