import os
import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Revise Tech Ltd API")

# Enable CORS for local React frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class Project(BaseModel):
    category: str
    filterCategory: str
    title: str
    desc: str
    status: str
    tags: List[str]
    link: Optional[str] = None

class EnquiryRequest(BaseModel):
    name: str
    email: EmailStr
    org: str
    ticket: str
    message: str

# In-memory database of projects (extracted from projects.js)
PROJECTS_DATABASE = [
    {
        "category": "AI · EdTech",
        "filterCategory": "ai",
        "title": "EduAI · Intelligent Learning Platform",
        "desc": "Real-time adaptive curricula for schools, universities, and corporate training—reimagining how learners and educators engage with content.",
        "status": "Active development · Global education market",
        "tags": ["AI-native", "High scalability"],
        "link": "https://edu-ai-sable-kappa.vercel.app/"
    },
    {
        "category": "AI · Content",
        "filterCategory": "ai",
        "title": "Inkwell AI · Writing & Content Engine",
        "desc": "Deep language models fused with brand-voice intelligence for creators, marketers, and teams needing high-fidelity content.",
        "status": "Live beta · B2C & B2B",
        "tags": ["Subscription & enterprise", "Content & marketing"],
        "link": "https://inkwell-ten-beige.vercel.app/"
    },
    {
        "category": "Fintech · Adtech",
        "filterCategory": "fintech",
        "title": "Pulserop · Pay-Per-Click Earnings",
        "desc": "Cumulative PPC earnings engine with intelligent monetisation tools, real-time analytics, and transparent payout infrastructure.",
        "status": "Revenue generating · Cumulative model",
        "tags": ["Publishers & affiliates", "Fintech"]
    },
    {
        "category": "AI · Creative",
        "filterCategory": "ai",
        "title": "StoryVerse · Interactive Storytelling",
        "desc": "Immersive AI-driven storytelling where users co-create narratives, worlds, and characters for entertainment and gaming.",
        "status": "In development · Entertainment tech",
        "tags": ["Creator economy", "Entertainment"],
        "link": "https://storyverse-liard.vercel.app/"
    },
    {
        "category": "SaaS · No-code",
        "filterCategory": "saas",
        "title": "Aleyo · Website Builder",
        "desc": "No-code/low-code website builder with AI-assisted design and copywriting for non-technical entrepreneurs and SMEs.",
        "status": "MVP live · SME market",
        "tags": ["Recurring SaaS revenue", "Web & SME"],
        "link": "https://aleyo-3-mu.vercel.app/"
    },
    {
        "category": "OCR · Fintech",
        "filterCategory": "fintech",
        "title": "Cheque Processor using OCR",
        "desc": "Enterprise-grade OCR that automates extraction, verification, and processing of physical cheque data for banks.",
        "status": "Pilot stage · Financial sector",
        "tags": ["Operational cost reduction", "Banking"],
        "link": "https://cheque-front-end-eight.vercel.app/home"
    },
    {
        "category": "AgriTech · AI",
        "filterCategory": "emerging",
        "title": "Drone Camera Biomass Prediction",
        "desc": "AI-powered drone imaging that predicts crop biomass, health, and yield for data-driven agricultural decisions.",
        "status": "Field trials · AgriTech",
        "tags": ["Precision agriculture", "AgriTech"]
    },
    {
        "category": "SaaS · Operations",
        "filterCategory": "saas",
        "title": "Inventory Studio",
        "desc": "Smart inventory management with AI-driven demand forecasting, multi-warehouse sync, and supplier intelligence.",
        "status": "Beta users · Supply chain",
        "tags": ["Retail & distribution", "Operations"]
    },
    {
        "category": "AI · Document Processing",
        "filterCategory": "ai",
        "title": "Intelligent Document Processor",
        "desc": "Advanced NLP and OCR to extract, classify, and process complex documents at scale for legal, insurance, and healthcare.",
        "status": "Enterprise ready · Compliance-focused",
        "tags": ["Reduced manual review", "Legal & healthcare"],
        "link": "https://etool-s.vercel.app/"
    },
    {
        "category": "AI · Productivity",
        "filterCategory": "saas",
        "title": "AI Kanban · Intelligent Project Board",
        "desc": "Smart AI-powered Kanban board with automated task prioritisation, intelligent suggestions, and real-time project intelligence.",
        "status": "Live · Productivity & project management",
        "tags": ["Teams & enterprise", "SaaS · AI"],
        "link": "https://smart-kanban-ashen.vercel.app/"
    },
    {
        "category": "Location Based Coke Finder",
        "filterCategory": "saas",
        "title": "Find A Coke Any Where You Have One",
        "desc": "Location Based Coke Finder using your default location or your post code",
        "status": "Live · Retailer Coke Sourcing",
        "tags": ["Location & Search", "SaaS ·Finder"],
        "link": "https://coke-finder.vercel.app/"
    },
]

@app.get("/api/projects", response_model=List[Project])
def get_projects():
    """Retrieve all incubation and venture projects."""
    return PROJECTS_DATABASE

@app.post("/api/enquire")
def post_enquiry(request: EnquiryRequest):
    """
    Log investor enquiry requests to a local text file.
    Replicates contact.php behaviors in Python.
    """
    # Quick validations
    if not request.name.strip() or not request.email.strip() or not request.message.strip():
        raise HTTPException(status_code=400, detail="Missing required field parameters.")

    # Structure the log entry matching contact.php
    timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = (
        "=========================================\n"
        f"TIMESTAMP:   {timestamp_str}\n"
        f"NAME:        {request.name}\n"
        f"EMAIL:       {request.email}\n"
        f"ORGANIZATION: {request.org}\n"
        f"TICKET SIZE: {request.ticket}\n"
        "MESSAGE:\n"
        f"{request.message}\n"
        "=========================================\n\n"
    )

    try:
        # Save to file 'enquiries.txt' in the parent directory (root directory of the project)
        # to remain fully compatible with PHP's output location
        filepath = os.path.join(os.path.dirname(os.path.dirname(__file__)), "enquiries.txt")
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(log_entry)
        
        return {
            "success": True,
            "message": "Enquiry received successfully!",
            "name": request.name,
            "email": request.email
        }
    except Exception as e:
        # Log error locally if writing fails
        print(f"Error saving enquiry: {e}")
        raise HTTPException(
            status_code=500,
            detail="Unable to process the request locally, but your parameters are valid."
        )


if __name__ == "__main__":
    app.run(app, host="localhost", port="8000")

