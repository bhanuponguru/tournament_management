import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os

load_dotenv()


class Database:
    def __init__(self):
        self.db = pooling.MySQLConnectionPool(
            pool_name="my_pool",
            pool_size=5,
            pool_reset_session=True,
            host=os.getenv("MYSQL_HOST"),
            port=os.getenv("MYSQL_PORT"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DB")
        )
    def get_connection(self):
        return self.db.get_connection()


db=Database()
