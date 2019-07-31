import re
import json
import argparse
import logging
import os.path
from os import walk
from flask import Flask, redirect, url_for, request
from flask import render_template
from flask import send_file

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")

@app.route('/')
@app.route('/home')
def homepage():
    return render_template('homepage.html', output=app.config["OUT"])

@app.route('/ner/labels')
def ner_labels():
    text_data = app.config["TEXT_DATA"]
    entities = [{"content":text, "entities":[]} for text in text_data]
    return render_template('labels.html', entities=entities)

@app.route('/ner/tagger/<id>')
def tagger(id):
    total_examples = len(app.config["TEXT_DATA"])
    if int(id)<0 or int(id)>total_examples-1:
        html = "OOR.html"
    else:
        html = 'ner_annotator.html'
    return render_template(html, id=id, examples=total_examples)

@app.route('/ner/prev/<id>/<entities>')
def prev(id, entities):
    if args.out is None:
        output_dir = "out.json"
    else:
        output_dir = args.out + ".json"
    if os.path.isfile(output_dir):
        with open(output_dir, 'r') as data_file:
            data = [json.loads(row) for row in data_file][0]
    else:
        text_data = app.config["TEXT_DATA"]
        data = [{"content":text, "entities":[]} for text in text_data]

    data[int(id)+1]['entities'] = json.loads(entities)

    with open(output_dir, 'w') as data_file:
        data_file.write(json.dumps(data))
    return redirect(url_for('tagger', id=id))

@app.route('/ner/next/<id>/<entities>')
def next(id, entities):
    if args.out is None:
        output_dir = "out.json"
    else:
        output_dir = args.out + ".json"
    if os.path.isfile(output_dir):
        with open(output_dir, 'r') as data_file:
            data = [json.loads(row) for row in data_file][0]
    else:
        text_data = app.config["TEXT_DATA"]
        data = [{"content":text, "entities":[]} for text in text_data]

    data[int(id)-1]['entities'] = entities

    with open(output_dir, 'w') as data_file:
        data_file.write(json.dumps(data))
    return redirect(url_for('tagger',id=id))

@app.route('/ner/finish/<id>/<entities>')
def finish(id, entities):
    if args.out is None:
        output_dir = "out.json"
    else:
        output_dir = args.out + ".json"
    if os.path.isfile(output_dir):
        with open(output_dir, 'r') as data_file:
            data = [json.loads(row) for row in data_file][0]
    else:
        text_data = app.config["TEXT_DATA"]
        data = [{"content":text, "entities":[]} for text in text_data]

    data[int(id)-1]['entities'] = entities

    with open(output_dir, 'w') as data_file:
        data_file.write(json.dumps(data))
    return redirect(url_for('homepage'))



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dir', type=str, help='specify the images directory')
    parser.add_argument('--file', type=str, help='specify the text file')
    parser.add_argument("--out", type=str, help='specify the output file')
    args = parser.parse_args()
    if args.dir is not None:
        directory = args.dir
        if directory[len(directory) - 1] != "/":
            directory += "/"
        app.config["IMAGES"] = directory
    elif args.file is not None:
        with open(args.file,'r') as file_data:
            app.config["TEXT_DATA"] = [re.sub("\n","",row) for row in file_data]
    else:
        logger.debug("no file or directory provided")



#    app.config["LABELS"] = []
#    files = None

#    for (dirpath, dirnames, filenames) in walk(app.config["IMAGES"]):
#        files = filenames
#        break

#    if files == None:
#        print("No files")
#        exit()
#    app.config["FILES"] = files
    app.config["HEAD"] = 0

    if args.out is None:
        app.config["OUT"] = "out"
    else:
        app.config["OUT"] = args.out

    app.run(debug="True")
