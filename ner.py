from startup import app
from flask import Flask, redirect, url_for, request
from flask import render_template

@app.route('/ner/home', methods=['GET', 'POST'])
def ner_home():

    return render_template('labels.html')