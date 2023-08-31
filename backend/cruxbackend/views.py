from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DataEntry
from .serializers import DataEntrySerializer
import gspread
from rest_framework.views import APIView
from rest_framework.response import Response
import openai
import os,json
from django.conf import settings
import requests
class GoogleSheetsToDB(APIView):
    def post(self, request):
        google_sheets_url = request.data.get('google_sheets_url')
        DataEntry.objects.all().delete()
        
        # Fetch data from Google Sheets
        gc = gspread.service_account(filename=settings.CRUX_CREDS_PATH) 
        sh = gc.open_by_url(google_sheets_url)
        worksheet = sh.get_worksheet(0)
        data = worksheet.get_all_records()
        # print(data)
        # Save data to the database
        for entry in data:
            DataEntry.objects.create(name=entry['year'], value=entry['sales'])
        
        return Response(status=status.HTTP_201_CREATED)


class ChatInterface(APIView):
    # def post(self, request):
        # user_query = request.data.get('user_query')
        
        # # Generate SQL statement using OpenAI API
        # openai.api_key = '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'
        # prompt = f"Generate an SQL query to retrieve data related to '{user_query}'"
        # response = openai.Completion.create(
        #     engine="text-davinci-003",
        #     prompt=prompt,
        #     max_tokens=200
        # )
        # generated_sql = response.choices[0].text.strip()
        
        # # Execute SQL on the database and get results
        # # Implement database query execution here
        
        # return Response({'response': f'SQL Query: {generated_sql}'})
        # def post(self, request):
        #     user_query = request.data.get('user_query')

        #     # Set up OpenRouter instance
        #     router = openrouteservice(api_key='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')

        #     # Define the template
        #     template = f"Generate an SQL query to retrieve data related to '{user_query}'"

        #     # Generate SQL statement using OpenRouter
        #     generated_sql = router.generate(template)

        #     # Execute SQL on the database and get results
        #     # Implement database query execution here

        #     return Response({'response': f'SQL Query: {generated_sql}'})
        # def post(self, request):
        #     user_query = request.data.get('user_query')
        
        # # Generate SQL statement using OpenRoute API
        #     openroute_api_url = 'https://api.openrouteservice.org/v2/directions/driving-car'
        #     api_key = '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'

        #     params = {
        #         'api_key': api_key,
        #         'query': user_query
        #     }

        #     response = requests.get(openroute_api_url, params=params)

        #     if response.status_code == 200:
        #         generated_sql = response.json()
        #         # Process the response as needed

        #         return Response({'response': f'SQL Query: {generated_sql}'})
        #     else:
        #         return Response({'error': 'Failed to generate SQL query'}, status=response.status_code)
        # def post(self, request):
        #     user_query = request.data.get('user_query')

        #     # Call OpenRoute API to generate SQL statement
        #     api_url = "https://api.openroute.com/v1/ai/query"
        #     headers = {
        #         "Content-Type": "application/json",
        #         "Authorization": "Bearer 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"
        #     }
        #     payload = {
        #         "query": user_query
        #     }
        #     response = requests.post(api_url, headers=headers, json=payload, verify=False)

        #     if response.status_code == 200:
        #         data = response.json()
        #         generated_sql = data.get("data", {}).get("sql", "")
        #         return Response({'response': f'SQL Query: {generated_sql}'})
        #     else:
        #         return Response({'response': 'Error generating SQL query'}, status=response.status_code)
        def post(self, request):
            user_query = request.data.get('user_query')

            # Generate SQL statement using OpenRouter API
            openrouter_api_key = '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'
            openrouter_url = 'https://openrouter.ai/api/v1/chat/completions'

            payload = {
                "model": "openai/gpt-4-32k",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_query}
                ]
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openrouter_api_key}",
                "HTTP-Referer": "http://127.0.0.1:8000/chat-interface/"
            }

            response = requests.post(openrouter_url, json=payload, headers=headers)
            response_data = response.json()
            print(response_data)

            # Extract the generated SQL query from the response
            generated_sql = response_data['choices'][0]['message']['content']

            # Execute SQL on the database and get results
            # Implement database query execution here

            return Response({'response': f'SQL Query: {generated_sql}'})
