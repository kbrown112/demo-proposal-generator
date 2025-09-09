create virtual environment: python -m venv env; env\Scripts\activate

install requirements: pip install -r requirements.txt

start backend: uvicorn main:app --reload

start frontend: npm run dev

curl request: curl -X POST "http://localhost:8000/proposal?topic=dolphins"
