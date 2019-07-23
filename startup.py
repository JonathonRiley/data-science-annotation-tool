import re
import argparse
import logging
from os import walk
from flask import Flask, redirect, url_for, request
from flask import render_template
from flask import send_file

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")

@app.route('/', methods=['GET', 'POST'])
@app.route('/home', methods=['GET', 'POST'])
def homepage():
    return render_template('homepage.html')

@app.route('/ner/labels')
def ner_labels():
    text_entities = app.config["FILE_ENTITIES"]
    return render_template('labels.html', text=text_entities)

@app.route('/ner/tagger/<id>')
def ner_annotator(id):
    return render_template('ner_annotator.html', id=id)



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
            text_entities = [{"content":re.sub("\n","",row),"entities":[]} for row in file_data]
        app.config["FILE_ENTITIES"] = text_entities
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
        app.config["OUT"] = "out.csv"
    else:
        app.config["OUT"] = args.out

    app.run(debug="True")
