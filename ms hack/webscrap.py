import requests
import json
from bs4 import BeautifulSoup

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
    
    # Extracting ICD-9 codes and short names from the JSON response
    icd9_codes = data[1]
    print(icd9_codes)
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
        print(summary_html)
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

if __name__ == "__main__":
    search_term = input("Enter the search term: ")
    icd9_codes = get_icd9_codes(search_term)
    
    if not icd9_codes:
        print(f"No ICD-9 codes found for '{search_term}'.")
    else:
        all_data = []
        for code in icd9_codes:
            print(f"Fetching data for ICD-9 code: {code}")
            medlineplus_data = get_medlineplus_data(code)
            all_data.append({
                "icd9_code": code,
                "medlineplus_data": medlineplus_data
            })
        
        print(json.dumps(all_data, indent=4))
