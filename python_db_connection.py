import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PORT = os.getenv('MYSQL_PORT')
DATABASE = os.getenv('DATABASE')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')

def db_connections():
    mydb = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=DATABASE,
        port=MYSQL_PORT
    )
    return mydb

mydb = db_connections()

def get_cursor():
    mydb = db_connections()
    return mydb, mydb.cursor()
