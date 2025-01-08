# AnyLangPod 🎧🌍

AnyLangPod is an AI-powered educational platform that transforms global news into personalized language learning podcasts. By leveraging GDELT data and advanced AI technologies, it creates engaging audio content tailored to different language proficiency levels.

## Features 🚀

- **Personalized News Selection**: Users can choose topics that interest them
- **Multi-Level Content**: Supports different language proficiency levels (Beginner/Intermediate/Advanced)
- **AI-Powered Summaries**: Intelligent content summarization and simplification
- **Real-Time Updates**: Fresh content from GDELT global news database
- **Professional Audio**: High-quality text-to-speech podcast generation
- **Learning Tools**: Vocabulary highlighting and contextual explanations

## Tech Stack 💻

- **Frontend**: Next.js
- **Backend**: FastAPI
- **AI/ML**: 
  - LLM for content summarization
  - Text-to-Speech for audio generation
- **Data Source**: GDELT API
- **Database**: TBD

## Getting Started 🌟

### Prerequisites

```bash
# Clone the repository
git clone https://github.com/hroyhong/anylanpod.git

# Navigate to the project directory
cd anylanpod

# Install dependencies
npm install  # for frontend
pip install -r requirements.txt  # for backend
```

[Setup instructions coming soon]

## Project Structure 📁

```
anylanpod/
├── frontend/          # Next.js frontend
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   └── styles/        # CSS styles
├── backend/           # FastAPI backend
│   ├── api/          # API routes
│   ├── services/     # Business logic
│   └── models/       # Data models
└── docs/             # Documentation
```

## API Documentation 📚

### Main Endpoints

- `POST /api/generate-podcast`
  - Generate a new podcast from selected topics
- `GET /api/topics`
  - Fetch available news topics
- `GET /api/levels`
  - Get available language proficiency levels

[Full API documentation coming soon]

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

MIT License - feel free to use, modify, and distribute!

## Contact 📧

Twitter: https://x.com/HroyhongHong

Project Link: https://github.com/hroyhong/anylanpod

---
Made with ❤️ for language learners worldwide