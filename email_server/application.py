#!/usr/bin/env python

from flask import render_template, jsonify, request, Flask
import requests
from pymongo import MongoClient
import json

# from settings import PRODUCTION, APP_SECRET

application = Flask(__name__)
application.debug = True
# application.config['SECRET_KEY'] = APP_SECRET


def get_user(email):
    user = None
    url = "http://127.0.0.1:8888/v1/chain/get_table_rows"
    data = {
        'json': True,
        'code': 'notechainacc',
        'scope': 'notechainacc',
        'table': 'notestruct',
        'limit': 100
    }
    r = requests.post(url, data=json.dumps(data))
    for row in r.json()['rows']:
        if row['email'] == email:
            user = row['user']
    return user


@application.route('/messages', methods=['GET', 'POST'])
def app():
    client = MongoClient('localhost', 27017)
    db = client.test_database
    messages = []
    if request.method == 'POST':
        message = {
            'to': request.form['recipient'],
            'from': request.form['sender'],
            'subject': request.form['subject'],
            'body': request.form['body-plain']
        }
        user = get_user(message['to'])
        message['user'] = user
        id = db.messages.insert_one(message).inserted_id
        print(message)
        print(id)

    elif request.method == 'GET':
        user = request.args['user']
        db_messages = db.messages.find({"user": user})
        for message in db_messages:
            del message['_id']
            messages.append(message)

    return jsonify({'messages': messages})


if __name__ == "__main__":
    application.debug = True
    # if PRODUCTION:
    #     application.debug = False
    application.run()
