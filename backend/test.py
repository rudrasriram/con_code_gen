import requests

url = "http://127.0.0.1:8000/generate_code/"
data = {"prompt": "reverse a string", "language": "Python"}

response = requests.post(url, json=data)
print(response.json())
