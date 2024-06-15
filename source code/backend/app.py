
from flask_cors import CORS
 
from flask import Flask, request, jsonify,Response
import json
import requests
from bs4 import BeautifulSoup
 
app=Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
@app.route("/")
def home():
    return "Welcome to HealthRecAPI"
def get_icd9_codes(term):
    base_url = "https://clinicaltables.nlm.nih.gov/api/icd9cm_dx/v3/search"
    params = {
        'terms': term,
        'ef': 'short_name'
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code != 200:
        return f"Error: Unable to fetch ICD-9 codes for {term}. Status code: {response.status_code}"
    
    data = response.json()
    
    
    icd9_codes = data[1]
    return icd9_codes

def format_icd9_code(icd9_code):
    if len(icd9_code) > 3:
        return icd9_code[:3] + '.' + icd9_code[3:]
    return icd9_code

def get_medlineplus_data(icd9_code):
    formatted_code = format_icd9_code(icd9_code)
    base_url = "https://connect.medlineplus.gov/service"
    params = {
        'mainSearchCriteria.v.cs': '2.16.840.1.113883.6.103',
        'mainSearchCriteria.v.c': formatted_code,
        'knowledgeResponseType': 'application/json'
    }
    
    response = requests.get(base_url, params=params)
    
    if response.status_code != 200:
        return f"Error: Unable to fetch MedlinePlus data for ICD-9 code {formatted_code}. Status code: {response.status_code}"
    
    data = response.json()
    return extract_medlineplus_data(data)

def extract_medlineplus_data(data):
    feed = data.get("feed", {})
    
    title = feed.get("title", {}).get("_value", "")
    subtitle = feed.get("subtitle", {}).get("_value", "")
    author = feed.get("author", {}).get("name", {}).get("_value", "")
    updated = feed.get("updated", {}).get("_value", "")
    
    entries = []
    for entry in feed.get("entry", []):
        summary_html = entry.get("summary", {}).get("_value", "")
        summary_text = BeautifulSoup(summary_html, "html.parser").get_text()
        entry_data = {
            "title": entry.get("title", {}).get("_value", ""),
            "link": entry.get("link", [{}])[0].get("href", ""),
            "summary": summary_text,
            "updated": entry.get("updated", {}).get("_value", "")
        }
        entries.append(entry_data)
    
    extracted_data = {
        "title": title,
        "subtitle": subtitle,
        "author": author,
        "updated": updated,
        "entries": entries
    }
    
    return extracted_data

@app.route('/get_data', methods=['POST'])
def get_icd9_medlineplus_data():
    data = request.json
    search_term = data.get('term')
    
    if not search_term:
        return jsonify({"error": "No search term provided"}), 400
    
    icd9_codes = get_icd9_codes(search_term)
    
    if not icd9_codes:
        return jsonify({"error": f"No ICD-9 codes found for '{search_term}'"}), 404
    
    all_data = []
    for code in icd9_codes:
        medlineplus_data = get_medlineplus_data(code)
        all_data.append({
            "icd9_code": code,
            "medlineplus_data": medlineplus_data
        })
        
    return jsonify(all_data), 200
  
if __name__=="__main__":
    app.run(host="0.0.0.0",debug=True,port=4000)