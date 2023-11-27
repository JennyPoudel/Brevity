from flask import Flask
from flask import render_template
import nltk
from string import punctuation
from heapq import nlargest
nltk.download('punkt')
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from flask import Flask, render_template, request, jsonify
from transformers import PegasusForConditionalGeneration, PegasusTokenizer
import torch
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi as ytt


app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template('app.html')

def extract_video_id(url:str):
    # Examples:
    # - http://youtu.be/SA2iWivDJiE
    # - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    # - http://www.youtube.com/embed/SA2iWivDJiE
    # - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
    query = urlparse(url)
    if query.hostname == 'youtu.be': return query.path[1:]
    if query.hostname in {'www.youtube.com', 'youtube.com'}:
        if query.path == '/watch': return parse_qs(query.query)['v'][0]
        if query.path[:7] == '/embed/': return query.path.split('/')[2]
        if query.path[:3] == '/v/': return query.path.split('/')[2]
    # fail?
    return None


@app.route('/summarize_ext_yt',methods=['GET','POST'])
def video_transcript():
    if request.method == 'POST':
        data = request.get_json()
        url= data.get("input_link")
        print(url)
        video_id = extract_video_id(url)
        data = ytt.get_transcript(video_id,languages=['de', 'en'])
        
        scripts = []
        for text in data:
            for key,value in text.items():
                if(key=='text'):
                    scripts.append(value)
        transcript = " ".join(scripts)
        print(transcript)
        summary = nltk_summarize(transcript,40)
        print(summary)
        return jsonify({"result": summary})

    else:
        return "ERROR"

@app.route('/url_summary', methods=['POST'])
def index():
    # Get the URL from the form input
    data = request.get_json()
    url= data.get("input_link")
    print(url)
    # Scrape the web page
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    # Extract the main text content
    main_text = extract_main_text(soup)
    print(main_text)
    # You need to write code here to extract the main text content from 'soup'
    # Summarize the text (you can use any summarization method here)
    summary = nltk_summarize(main_text,40)
    return jsonify({"result": summary})


def extract_main_text(soup):
    main_text = ""
    paragraphs = soup.find_all('p')
    for paragraph in paragraphs:
        main_text += paragraph.get_text() + " "
    return main_text.strip()




@app.route("/summarize", methods=["POST"])
def summarizee():
    data = request.get_json()
    input_text= data.get("input_text")
    percent = data.get("percent")  # Make sure you're using the correct key
    result = nltk_summarize(input_text,percent)
    return jsonify({"result": result})

@app.route("/summarize_abs", methods=["POST"])
def summarize_abs():
    data = request.get_json()
    input_text = data.get('input_text')
    
    
    # if not input_text:
    #     return jsonify({'error': 'Missing or empty "input_text" parameter'}), 400
    
    summary = generate_summary(input_text)
    return jsonify({'summary': summary})

def nltk_summarize(text_content, percent):
    tokens = word_tokenize(text_content)
    stop_words = stopwords.words('english')
    punctuation_items = punctuation + '\n'

    word_frequencies = {}
    for word in tokens:
        if word.lower() not in stop_words:
            if word.lower() not in punctuation_items:
                if word not in word_frequencies.keys():
                    word_frequencies[word] = 1
                else:
                    word_frequencies[word] += 1
    max_frequency = max(word_frequencies.values())

    for word in word_frequencies.keys():
        word_frequencies[word] = word_frequencies[word] / max_frequency
    sentence_token = sent_tokenize(text_content)
    sentence_scores = {}
    for sent in sentence_token:
        sentence = sent.split(" ")
        for word in sentence:
            if word.lower() in word_frequencies.keys():
                if sent not in sentence_scores.keys():
                    sentence_scores[sent] = word_frequencies[word.lower()]
                else:
                    sentence_scores[sent] += word_frequencies[word.lower()]

    select_length = int(len(sentence_token) * (int(percent) / 100))
    summary = nlargest(select_length, sentence_scores, key=sentence_scores.get)
    final_summary = [word for word in summary]
    summary = ' '.join(final_summary)
    return summary



def generate_summary(input_text):
    model_name = "google/pegasus-xsum"
    device = "cuda" if torch.cuda.is_available() else "cpu"

    tokenizer = PegasusTokenizer.from_pretrained(model_name)
    model = PegasusForConditionalGeneration.from_pretrained(model_name).to(device)

    batch = tokenizer(input_text, truncation=True, padding="longest", return_tensors="pt").to(device)
    translated = model.generate(**batch)
    tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)

    return tgt_text

