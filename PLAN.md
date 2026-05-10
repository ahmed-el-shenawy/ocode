# CraftCV — CV/Resume Builder

## Tech Stack
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI (Python 3.12+)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: LiteLLM Router (OpenAI, Anthropic, Google, Ollama)
- **PDF**: Playwright (headless browser HTML→PDF)
- **Editor**: @dnd-kit (drag & drop) + TipTap (rich text)

---

## 1. Monorepo Directory Structure

```
craftcv/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── dependencies.py
│   │   │   ├── security.py
│   │   │   └── supabase.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── conversation.py
│   │   │   ├── resume.py
│   │   │   ├── template.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── resume.py
│   │   │   └── template.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── conversation_repo.py
│   │   │   ├── resume_repo.py
│   │   │   ├── template_repo.py
│   │   │   └── user_repo.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── chat_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── resume_service.py
│   │   │   ├── studio_service.py
│   │   │   └── template_service.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       ├── chat.py
│   │   │       ├── pdf.py
│   │   │       ├── resumes.py
│   │   │       ├── studio.py
│   │   │       └── templates.py
│   │   └── agents/
│   │       ├── __init__.py
│   │       ├── cv_agent.py
│   │       ├── router.py
│   │       ├── tools/
│   │       │   ├── __init__.py
│   │       │   ├── content_tools.py
│   │       │   ├── resume_tools.py
│   │       │   └── web_search.py
│   │       └── prompts/
│   │           ├── sections.py
│   │           └── system.md
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 00001_initial_schema.sql
│   │   └── seed.sql
│   ├── tests/
│   │   └── __init__.py
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── .gitkeep
│   ├── alembic.ini
│   ├── .env.example
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── ruff.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── templates/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   │   ├── studio/
│   │   │   │   └── [resumeId]/page.tsx
│   │   │   ├── chat/
│   │   │   │   └── [resumeId]/page.tsx
│   │   │   └── resume/
│   │   │       └── [resumeId]/preview/page.tsx
│   │   ├── __tests__/
│   │   │   └── .gitkeep
│   │   ├── components/
│   │   │   ├── ui/  (shadcn components)
│   │   │   ├── layout/
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── studio/
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── SectionPicker.tsx
│   │   │   │   ├── StylePanel.tsx
│   │   │   │   ├── Widget.tsx
│   │   │   │   ├── WidgetToolbar.tsx
│   │   │   │   └── widgets/
│   │   │   │       ├── CertificationsWidget.tsx
│   │   │   │       ├── CustomWidget.tsx
│   │   │   │       ├── EducationWidget.tsx
│   │   │   │       ├── ExperienceWidget.tsx
│   │   │   │       ├── HeaderWidget.tsx
│   │   │   │       ├── LanguagesWidget.tsx
│   │   │   │       ├── ProjectsWidget.tsx
│   │   │   │       ├── SkillsWidget.tsx
│   │   │   │       └── SummaryWidget.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── GuidedFlowIndicator.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── SectionProgress.tsx
│   │   │   ├── templates/
│   │   │   │   ├── TemplateCard.tsx
│   │   │   │   ├── TemplateGrid.tsx
│   │   │   │   └── TemplatePreview.tsx
│   │   │   └── resume/
│   │   │       ├── ResumeListItem.tsx
│   │   │       └── ResumePreview.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useChat.ts
│   │   │   ├── useResume.ts
│   │   │   ├── useStudio.ts
│   │   │   └── useTemplates.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── constants.ts
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── stores/
│   │   │   ├── chat-store.ts
│   │   │   └── studio-store.ts
│   │   └── types/
│   │       ├── chat.ts
│   │       ├── resume.ts
│   │       └── template.ts
│   ├── public/
│   ├── components.json  (shadcn)
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── .env.local.example
│   ├── .eslintrc.json
│   ├── next.config.ts
│   ├── package.json
│   ├── .prettierrc
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .dockerignore
├── docker-compose.yml
├── .env.example
├── .gitignore
└── PLAN.md  (this file)
```

---

## 2. Database Schema (Supabase SQL)

```sql
-- Executed via Supabase SQL Editor or migration

-- Profiles table (extends Supabase Auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Templates (predefined system templates + user-created)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  definition JSONB NOT NULL,
  default_styles JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Resumes (user's actual resumes based on templates)
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  content JSONB NOT NULL DEFAULT '{"sections": []}',
  styles JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Conversations (AI chat sessions per resume)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  progress JSONB NOT NULL DEFAULT '{}',
  mode TEXT NOT NULL DEFAULT 'guided' CHECK (mode IN ('guided','free')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Messages in conversations
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_is_public ON templates(is_public);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_template_id ON resumes(template_id);
CREATE INDEX idx_conversations_resume_id ON conversations(resume_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

## 3. Template JSON Definition Format

Each template's `definition` field is a JSON object:

```json
{
  "sections": [
    {
      "id": "header",
      "type": "header",
      "label": "Header",
      "required": true,
      "max_items": 1,
      "fields": {
        "full_name": { "type": "text", "label": "Full Name", "required": true },
        "email": { "type": "text", "label": "Email", "required": true },
        "phone": { "type": "text", "label": "Phone" },
        "location": { "type": "text", "label": "Location" },
        "linkedin": { "type": "url", "label": "LinkedIn URL" },
        "portfolio": { "type": "url", "label": "Portfolio URL" },
        "headline": { "type": "text", "label": "Professional Headline" }
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "label": "Professional Summary",
      "max_items": 1,
      "fields": {
        "content": { "type": "richtext", "label": "Summary", "max_length": 500 }
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "label": "Experience",
      "min_items": 0,
      "max_items": 5,
      "fields": {
        "company": { "type": "text", "label": "Company", "required": true },
        "position": { "type": "text", "label": "Position", "required": true },
        "start_date": { "type": "date", "label": "Start Date" },
        "end_date": { "type": "date", "label": "End Date" },
        "current": { "type": "boolean", "label": "Current Position" },
        "location": { "type": "text", "label": "Location" },
        "bullets": { "type": "list", "label": "Bullets", "min": 2, "max": 5 }
      }
    },
    {
      "id": "education",
      "type": "education",
      "label": "Education",
      "min_items": 0,
      "max_items": 3,
      "fields": {
        "institution": { "type": "text", "label": "Institution", "required": true },
        "degree": { "type": "text", "label": "Degree" },
        "field": { "type": "text", "label": "Field of Study" },
        "start_date": { "type": "date", "label": "Start Date" },
        "end_date": { "type": "date", "label": "End Date" },
        "gpa": { "type": "text", "label": "GPA" }
      }
    },
    {
      "id": "projects",
      "type": "projects",
      "label": "Projects",
      "min_items": 0,
      "max_items": 5,
      "fields": {
        "title": { "type": "text", "label": "Project Title", "required": true },
        "link": { "type": "url", "label": "Project Link" },
        "bullets": { "type": "list", "label": "Details", "min": 2, "max": 4 }
      }
    },
    {
      "id": "skills",
      "type": "skills",
      "label": "Skills",
      "fields": {
        "category": { "type": "text", "label": "Category" },
        "skills": { "type": "tags", "label": "Skills" }
      }
    },
    {
      "id": "certifications",
      "type": "certifications",
      "label": "Certifications",
      "fields": {
        "name": { "type": "text", "label": "Certification Name" },
        "issuer": { "type": "text", "label": "Issuer" },
        "date": { "type": "date", "label": "Date Obtained" },
        "link": { "type": "url", "label": "Credential URL" }
      }
    },
    {
      "id": "languages",
      "type": "languages",
      "label": "Languages",
      "fields": {
        "language": { "type": "text", "label": "Language" },
        "proficiency": { "type": "select", "label": "Proficiency", "options": ["Native","Fluent","Advanced","Intermediate","Basic"] }
      }
    },
    {
      "id": "custom",
      "type": "custom",
      "label": "Custom Section",
      "fields": {
        "title": { "type": "text", "label": "Section Title" },
        "content": { "type": "richtext", "label": "Content" }
      }
    }
  ],
  "layout": {
    "columns": 1,
    "color_scheme": {
      "primary": "#1a365d",
      "secondary": "#2d3748",
      "accent": "#3182ce",
      "background": "#ffffff",
      "text": "#1a202c"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  }
}
```

The resume's `content` field stores filled data following this structure:
```json
{
  "sections": [
    {
      "section_id": "header",
      "type": "header",
      "items": [
        {
          "full_name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890",
          "headline": "Senior Software Engineer"
        }
      ]
    },
    {
      "section_id": "experience",
      "type": "experience",
      "items": [
        {
          "company": "Google",
          "position": "Software Engineer",
          "start_date": "2020-01",
          "current": true,
          "bullets": [
            "Led migration of monolith to microservices, reducing deployment time by 60%",
            "Designed and implemented real-time data pipeline processing 10M events/day"
          ]
        }
      ]
    }
  ]
}
```

---

## 4. Backend Implementation (FastAPI)

### 4.1 Project Setup

**backend/pyproject.toml:**
```toml
[project]
name = "craftcv-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "sqlalchemy[asyncio]>=2.0.36",
    "asyncpg>=0.30.0",
    "alembic>=1.14.0",
    "pydantic>=2.10.0",
    "pydantic-settings>=2.6.0",
    "supabase>=2.6.0",
    "litellm>=1.50.0",
    "playwright>=1.49.0",
    "jinja2>=3.1.4",
    "python-multipart>=0.0.12",
    "httpx>=0.28.0",
    "duckduckgo-search>=7.5.0",
    "celery>=5.4.0",
    "redis>=5.2.0",
    "python-dotenv>=1.0.1",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.28.0",
]
```

### 4.2 Core Configuration

**backend/app/core/config.py:**
```python
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CraftCV"
    debug: bool = False

    # Supabase
    supabase_url: str
    supabase_service_key: str
    supabase_anon_key: str

    # Database
    database_url: str

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"

    # LiteLLM
    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    gemini_api_key: str | None = None

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Storage
    storage_bucket: str = "resumes"
    pdf_storage_path: str = "pdfs"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
```

**backend/app/core/database.py:**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


engine = create_async_engine(settings.database_url, echo=settings.debug)
async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 4.3 Models (SQLAlchemy)

**backend/app/models/user.py:**
```python
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str | None] = mapped_column(String(255))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

**backend/app/models/template.py:**
```python
import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500))
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    definition: Mapped[dict] = mapped_column(JSONB)
    default_styles: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

**backend/app/models/resume.py:**
```python
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    template_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="SET NULL"))
    title: Mapped[str] = mapped_column(String(255), default="Untitled Resume")
    content: Mapped[dict] = mapped_column(JSONB, default=lambda: {"sections": []})
    styles: Mapped[dict] = mapped_column(JSONB, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

**backend/app/models/conversation.py:**
```python
import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"))
    progress: Mapped[dict] = mapped_column(JSONB, default=dict)
    mode: Mapped[str] = mapped_column(String(10), default="guided")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String(10))
    content: Mapped[str] = mapped_column(Text)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

### 4.4 Schema Layer (Pydantic)

**backend/app/schemas/template.py:**
```python
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Any


class TemplateField(BaseModel):
    type: str  # text, url, date, boolean, richtext, list, tags, select
    label: str
    required: bool = False
    max_length: int | None = None
    min: int | None = None
    max: int | None = None
    options: list[str] | None = None


class SectionDefinition(BaseModel):
    id: str
    type: str
    label: str
    required: bool = False
    min_items: int | None = None
    max_items: int | None = None
    fields: dict[str, TemplateField]


class LayoutDefinition(BaseModel):
    columns: int = 1
    color_scheme: dict[str, str] = {}
    fonts: dict[str, str] = {}


class TemplateDefinition(BaseModel):
    sections: list[SectionDefinition]
    layout: LayoutDefinition = LayoutDefinition()


class TemplateCreate(BaseModel):
    name: str
    description: str | None = None
    definition: TemplateDefinition
    default_styles: dict[str, Any] = {}
    is_public: bool = False


class TemplateResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    thumbnail_url: str | None
    is_public: bool
    definition: dict
    default_styles: dict
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

**backend/app/schemas/resume.py:**
```python
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Any


class SectionItemData(BaseModel):
    section_id: str
    type: str
    items: list[dict[str, Any]]


class ResumeContent(BaseModel):
    sections: list[SectionItemData]


class ResumeCreate(BaseModel):
    template_id: UUID
    title: str = "Untitled Resume"


class ResumeUpdate(BaseModel):
    title: str | None = None
    content: dict | None = None
    styles: dict | None = None
    status: str | None = None


class ResumeResponse(BaseModel):
    id: UUID
    template_id: UUID | None
    title: str
    content: dict
    styles: dict
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
```

### 4.5 Repository Layer

**backend/app/repositories/base.py:**
```python
from typing import TypeVar, Generic
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, session: AsyncSession, model: type[T]):
        self.session = session
        self.model = model

    async def get_by_id(self, id: UUID) -> T | None:
        stmt = select(self.model).where(self.model.id == id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list(self, skip: int = 0, limit: int = 100) -> list[T]:
        stmt = select(self.model).offset(skip).limit(limit).order_by(self.model.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create(self, obj: T) -> T:
        self.session.add(obj)
        await self.session.flush()
        return obj

    async def update(self, obj: T) -> T:
        await self.session.merge(obj)
        await self.session.flush()
        return obj

    async def delete(self, obj: T) -> None:
        await self.session.delete(obj)
        await self.session.flush()

    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model)
        result = await self.session.execute(stmt)
        return result.scalar() or 0
```

**backend/app/repositories/template_repo.py:**
```python
from uuid import UUID
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.template import Template


class TemplateRepository(BaseRepository[Template]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Template)

    async def get_public_templates(self, skip: int = 0, limit: int = 100) -> list[Template]:
        stmt = (
            select(Template)
            .where(Template.is_public == True)
            .offset(skip)
            .limit(limit)
            .order_by(Template.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_user_templates(self, user_id: UUID) -> list[Template]:
        stmt = (
            select(Template)
            .where(Template.user_id == user_id)
            .order_by(Template.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_available_for_user(self, user_id: UUID) -> list[Template]:
        stmt = (
            select(Template)
            .where(or_(Template.is_public == True, Template.user_id == user_id))
            .order_by(Template.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
```

### 4.6 Service Layer

**backend/app/services/template_service.py:**
```python
from uuid import UUID
from app.repositories.template_repo import TemplateRepository
from app.models.template import Template


class TemplateService:
    def __init__(self, repo: TemplateRepository):
        self.repo = repo

    async def get_by_id(self, id: UUID) -> Template | None:
        return await self.repo.get_by_id(id)

    async def get_public_templates(self, skip: int = 0, limit: int = 100) -> list[Template]:
        return await self.repo.get_public_templates(skip, limit)

    async def get_user_templates(self, user_id: UUID) -> list[Template]:
        return await self.repo.get_user_templates(user_id)

    async def get_available_for_user(self, user_id: UUID) -> list[Template]:
        return await self.repo.get_available_for_user(user_id)

    async def create_from_template(self, user_id: UUID, template_id: UUID) -> Template:
        """Clone a template as user's own."""
        original = await self.repo.get_by_id(template_id)
        if not original:
            raise ValueError("Template not found")
        new_template = Template(
            user_id=user_id,
            name=f"{original.name} (customized)",
            description=original.description,
            definition=original.definition,
            default_styles=original.default_styles,
            is_public=False,
        )
        return await self.repo.create(new_template)
```

**backend/app/services/resume_service.py:**
```python
from uuid import UUID
from app.repositories.resume_repo import ResumeRepository
from app.repositories.template_repo import TemplateRepository
from app.models.resume import Resume


class ResumeService:
    def __init__(self, resume_repo: ResumeRepository, template_repo: TemplateRepository):
        self.resume_repo = resume_repo
        self.template_repo = template_repo

    async def get_by_id(self, id: UUID) -> Resume | None:
        return await self.resume_repo.get_by_id(id)

    async def get_user_resumes(self, user_id: UUID) -> list[Resume]:
        return await self.resume_repo.get_by_user_id(user_id)

    async def create_from_template(self, user_id: UUID, template_id: UUID, title: str = "Untitled Resume") -> Resume:
        template = await self.template_repo.get_by_id(template_id)
        if not template:
            raise ValueError("Template not found")

        # Build initial content from template definition
        initial_sections = []
        for sec in template.definition.get("sections", []):
            initial_sections.append({
                "section_id": sec["id"],
                "type": sec["type"],
                "items": [],
            })

        resume = Resume(
            user_id=user_id,
            template_id=template_id,
            title=title,
            content={"sections": initial_sections},
            styles=template.default_styles.copy(),
            status="draft",
        )
        return await self.resume_repo.create(resume)

    async def update_content(self, resume_id: UUID, content: dict) -> Resume:
        resume = await self.resume_repo.get_by_id(resume_id)
        if not resume:
            raise ValueError("Resume not found")
        resume.content = content
        return await self.resume_repo.update(resume)

    async def update_styles(self, resume_id: UUID, styles: dict) -> Resume:
        resume = await self.resume_repo.get_by_id(resume_id)
        if not resume:
            raise ValueError("Resume not found")
        resume.styles = styles
        return await self.resume_repo.update(resume)
```

**backend/app/services/chat_service.py:**
```python
from uuid import UUID
from app.repositories.conversation_repo import ConversationRepository
from app.repositories.resume_repo import ResumeRepository
from app.models.conversation import Conversation, Message
from app.agents.cv_agent import CvAgent


class ChatService:
    def __init__(
        self,
        conversation_repo: ConversationRepository,
        resume_repo: ResumeRepository,
        agent: CvAgent,
    ):
        self.conversation_repo = conversation_repo
        self.resume_repo = resume_repo
        self.agent = agent

    async def get_or_create_conversation(self, resume_id: UUID, user_id: UUID) -> Conversation:
        existing = await self.conversation_repo.get_by_resume_and_user(resume_id, user_id)
        if existing:
            return existing
        conversation = Conversation(
            resume_id=resume_id,
            user_id=user_id,
            mode="guided",
            progress={},
        )
        return await self.conversation_repo.create(conversation)

    async def send_message(self, conversation_id: UUID, content: str) -> Message:
        # Save user message
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=content,
        )
        await self.conversation_repo.add_message(user_msg)

        # Get conversation history
        conversation = await self.conversation_repo.get_by_id(conversation_id)
        messages = await self.conversation_repo.get_messages(conversation_id)

        # Get resume context
        resume = await self.resume_repo.get_by_id(conversation.resume_id)

        # Generate AI response
        response_content, progress_update = await self.agent.process(
            resume=resume,
            conversation=conversation,
            messages=messages,
            user_input=content,
        )

        # Update progress
        if progress_update:
            conversation.progress = {**conversation.progress, **progress_update}
            await self.conversation_repo.update(conversation)

        # Save assistant message
        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=response_content,
        )
        return await self.conversation_repo.add_message(assistant_msg)

    async def switch_mode(self, conversation_id: UUID, mode: str) -> Conversation:
        conversation = await self.conversation_repo.get_by_id(conversation_id)
        if not conversation:
            raise ValueError("Conversation not found")
        conversation.mode = mode
        return await self.conversation_repo.update(conversation)
```

### 4.7 API Routes

**backend/app/api/v1/auth.py:**
```python
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client

from app.core.dependencies import get_supabase
from app.schemas.auth import SignUpRequest, SignInRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest, supabase: Client = Depends(get_supabase)):
    try:
        result = supabase.auth.sign_up({"email": request.email, "password": request.password})
        return AuthResponse(user_id=result.user.id, email=result.user.email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SignInRequest, supabase: Client = Depends(get_supabase)):
    try:
        result = supabase.auth.sign_in_with_password({"email": request.email, "password": request.password})
        return AuthResponse(
            user_id=result.user.id,
            email=result.user.email,
            access_token=result.session.access_token,
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase)):
    supabase.auth.sign_out()
    return {"message": "Logged out successfully"}
```

**backend/app/api/v1/resumes.py:**
```python
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.repositories.resume_repo import ResumeRepository
from app.repositories.template_repo import TemplateRepository
from app.services.resume_service import ResumeService
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse

router = APIRouter(prefix="/resumes", tags=["resumes"])


async def get_resume_service(db: AsyncSession = Depends(get_db)) -> ResumeService:
    return ResumeService(
        resume_repo=ResumeRepository(db),
        template_repo=TemplateRepository(db),
    )


@router.get("/", response_model=list[ResumeResponse])
async def list_resumes(
    user_id: UUID = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    return await service.get_user_resumes(user_id)


@router.post("/", response_model=ResumeResponse)
async def create_resume(
    request: ResumeCreate,
    user_id: UUID = Depends(get_current_user),
    service: ResumeService = Depends(get_resume_service),
):
    return await service.create_from_template(user_id, request.template_id, request.title)


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: UUID,
    service: ResumeService = Depends(get_resume_service),
):
    resume = await service.get_by_id(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: UUID,
    request: ResumeUpdate,
    service: ResumeService = Depends(get_resume_service),
):
    resume = await service.get_by_id(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if request.content is not None:
        resume = await service.update_content(resume_id, request.content)
    if request.styles is not None:
        resume = await service.update_styles(resume_id, request.styles)
    if request.title is not None:
        resume.title = request.title
    if request.status is not None:
        resume.status = request.status
    return await service.resume_repo.update(resume)


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: UUID,
    service: ResumeService = Depends(get_resume_service),
):
    resume = await service.get_by_id(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    await service.resume_repo.delete(resume)
    return {"message": "Resume deleted"}
```

**backend/app/api/v1/chat.py:**
```python
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.repositories.conversation_repo import ConversationRepository
from app.repositories.resume_repo import ResumeRepository
from app.services.chat_service import ChatService
from app.agents.cv_agent import CvAgent
from app.schemas.chat import SendMessageRequest, SendMessageResponse, SwitchModeRequest

router = APIRouter(prefix="/chat", tags=["chat"])


async def get_chat_service(db: AsyncSession = Depends(get_db)) -> ChatService:
    conversation_repo = ConversationRepository(db)
    resume_repo = ResumeRepository(db)
    agent = CvAgent()
    return ChatService(
        conversation_repo=conversation_repo,
        resume_repo=resume_repo,
        agent=agent,
    )


@router.post("/conversation/{resume_id}")
async def start_or_get_conversation(
    resume_id: UUID,
    user_id: UUID = Depends(get_current_user),
    service: ChatService = Depends(get_chat_service),
):
    conversation = await service.get_or_create_conversation(resume_id, user_id)
    return {"conversation_id": conversation.id, "mode": conversation.mode, "progress": conversation.progress}


@router.post("/message/{conversation_id}")
async def send_message(
    conversation_id: UUID,
    request: SendMessageRequest,
    service: ChatService = Depends(get_chat_service),
):
    message = await service.send_message(conversation_id, request.content)
    return SendMessageResponse(content=message.content, role=message.role)


@router.post("/switch-mode/{conversation_id}")
async def switch_mode(
    conversation_id: UUID,
    request: SwitchModeRequest,
    service: ChatService = Depends(get_chat_service),
):
    conversation = await service.switch_mode(conversation_id, request.mode)
    return {"mode": conversation.mode}
```

### 4.8 AI Agent

**backend/app/agents/router.py:**
```python
import os
from litellm import Router

router = Router(
    model_list=[
        {
            "model_name": "gpt-4o",
            "litellm_params": {
                "model": "openai/gpt-4o",
                "api_key": os.getenv("OPENAI_API_KEY"),
            },
        },
        {
            "model_name": "claude-sonnet",
            "litellm_params": {
                "model": "anthropic/claude-3-5-sonnet-20241022",
                "api_key": os.getenv("ANTHROPIC_API_KEY"),
            },
        },
        {
            "model_name": "gemini-pro",
            "litellm_params": {
                "model": "gemini/gemini-1.5-pro",
                "api_key": os.getenv("GEMINI_API_KEY"),
            },
        },
        {
            "model_name": "fallback-local",
            "litellm_params": {
                "model": "ollama/llama3",
                "api_base": os.getenv("OLLAMA_API_BASE", "http://localhost:11434"),
            },
        },
    ],
    fallbacks=[{"gpt-4o": ["claude-sonnet", "gemini-pro"]}],
    context_window_fallbacks=[{"gpt-4o": ["gemini-pro"], "claude-sonnet": ["gemini-pro"]}],
    num_retries=2,
)


async def generate(
    messages: list[dict],
    model: str = "gpt-4o",
    temperature: float = 0.7,
    **kwargs,
) -> str:
    response = await router.acompletion(
        model=model,
        messages=messages,
        temperature=temperature,
        **kwargs,
    )
    return response.choices[0].message.content
```

**backend/app/agents/cv_agent.py:**
```python
from typing import Any
from app.agents.router import generate
from app.agents.tools.web_search import web_search
from app.agents.tools.resume_tools import get_section_info, update_section
from app.agents.tools.content_tools import humanize_text, suggest_improvements


SYSTEM_PROMPT = """You are an expert CV/resume writing assistant. Your job is to help users create professional resumes.

## Your Personality & Style
- Friendly, encouraging, and professional
- Concise but thorough
- Proactive in suggesting improvements
- Never use AI-sounding phrases like "I'm here to help" or "Certainly!"
- Sound like a real human career coach

## Core Workflow
1. First, introduce the section you'll work on
2. Ask ONE question at a time (never overwhelm the user)
3. Validate responses and suggest improvements
4. After each section, ask if they want to continue or edit
5. Track progress across all sections

## Section Order (guided mode)
header → summary → experience → education → skills → projects → certifications → languages

## Quality Rules
- Bullet points must start with strong action verbs (Led, Developed, Designed, etc.)
- Quantify achievements where possible (% increases, $ amounts, time saved)
- Remove clichés and buzzwords (team player, go-getter, etc.)
- Rewrite AI-sounding phrases into natural human language
- Each experience needs 2-5 bullet points
- Keep summary under 4 sentences

## Tools Available
- web_search: Search for company info, industry trends, salary data
- get_section_info: Get current section data from the resume
- update_section: Save filled data to the resume
- humanize_text: Rewrite text to sound more natural
- suggest_improvements: Get suggestions to improve content

## Humanization Rules
When asked to "humanize" content:
- Remove: "Leveraged", "Utilized", "Optimized" (unless quantified)
- Remove: "Dynamic", "Results-driven", "Proven track record"
- Replace passive voice with active voice
- Use real, specific language
- Keep accomplishments but make them sound like a real person wrote them
"""


class CvAgent:
    def __init__(self):
        self.system_prompt = SYSTEM_PROMPT

    async def process(
        self,
        resume: Any,
        conversation: Any,
        messages: list[Any],
        user_input: str,
    ) -> tuple[str, dict | None]:
        # Build context from resume
        resume_context = self._build_resume_context(resume, conversation)

        # Detect intent: guided answer, free-form question, tool request
        intent = await self._detect_intent(user_input, messages)

        if intent == "tool_request":
            return await self._handle_tool_request(user_input, resume)
        
        if intent == "guided_answer":
            return await self._handle_guided_answer(user_input, resume, conversation, messages)

        return await self._handle_free_form(user_input, resume, conversation, messages)

    def _build_resume_context(self, resume: Any, conversation: Any) -> str:
        sections = resume.content.get("sections", [])
        filled = []
        empty = []
        for sec in sections:
            if sec.get("items"):
                filled.append(sec["type"])
            else:
                empty.append(sec["type"])
        return f"""
Current resume: {resume.title}
Template sections: {[s['type'] for s in sections]}
Filled sections: {filled}
Empty sections: {empty}
Progress: {conversation.progress}
Mode: {conversation.mode}
"""

    async def _detect_intent(self, user_input: str, messages: list) -> str:
        detection_prompt = [
            {"role": "system", "content": "Classify the user's intent as one of: 'guided_answer' (direct answer to a guided question), 'free_form' (general conversation/question), 'tool_request' (asking for web search, humanize, or suggestions). Respond with only the intent label."},
            {"role": "user", "content": user_input},
        ]
        intent = await generate(detection_prompt, model="gpt-4o-mini", temperature=0)
        return intent.strip().lower()

    async def _handle_guided_answer(self, user_input: str, resume: Any, conversation: Any, messages: list) -> tuple[str, dict]:
        chat_messages = [
            {"role": "system", "content": self.system_prompt + "\n\n" + self._build_resume_context(resume, conversation)},
        ]
        for msg in messages[-10:]:  # Last 10 messages for context
            chat_messages.append({"role": msg.role, "content": msg.content})
        chat_messages.append({"role": "user", "content": user_input})

        response = await generate(chat_messages, model="gpt-4o", temperature=0.7)
        
        # Extract progress update from response metadata
        progress_update = self._extract_progress(response)
        
        return response, progress_update

    async def _handle_free_form(self, user_input: str, resume: Any, conversation: Any, messages: list) -> tuple[str, dict]:
        chat_messages = [
            {"role": "system", "content": self.system_prompt + "\n\n" + self._build_resume_context(resume, conversation)},
        ]
        for msg in messages[-20:]:
            chat_messages.append({"role": msg.role, "content": msg.content})
        chat_messages.append({"role": "user", "content": user_input})

        response = await generate(chat_messages, model="gpt-4o", temperature=0.8)
        return response, None

    async def _handle_tool_request(self, user_input: str, resume: Any) -> tuple[str, dict]:
        tool_prompt = [
            {"role": "system", "content": "Parse the tool request. Respond with JSON: {\"tool\": \"web_search|humanize|suggest\", \"query\": \"...\"}"},
            {"role": "user", "content": user_input},
        ]
        parsed = await generate(tool_prompt, model="gpt-4o-mini", temperature=0)
        
        import json
        try:
            parsed_json = json.loads(parsed)
            if parsed_json["tool"] == "web_search":
                results = await web_search(parsed_json["query"])
                return self._format_search_results(results), None
            elif parsed_json["tool"] == "humanize":
                result = await humanize_text(parsed_json["query"])
                return result, None
            elif parsed_json["tool"] == "suggest":
                result = await suggest_improvements(parsed_json["query"])
                return result, None
        except (json.JSONDecodeError, KeyError):
            return "I can help with that! Could you be more specific about what you'd like me to search for, humanize, or improve?", None
        
        return "I'm not sure how to handle that request. Could you rephrase?", None

    def _extract_progress(self, response: str) -> dict | None:
        # Simple heuristic: if response mentions section completion
        progress_markers = ["completed", "finished", "done with", "moving to", "next section"]
        for marker in progress_markers:
            if marker in response.lower():
                return {"last_updated": "auto"}
        return None

    def _format_search_results(self, results: list[dict]) -> str:
        formatted = "Here's what I found:\n\n"
        for r in results[:3]:
            formatted += f"**{r.get('title', '')}**\n{r.get('snippet', '')}\n\n"
        return formatted
```

**backend/app/agents/tools/web_search.py:**
```python
from duckduckgo_search import DDGS


async def web_search(query: str, max_results: int = 5) -> list[dict]:
    """Search the web for CV-related information."""
    with DDGS() as ddgs:
        results = []
        for r in ddgs.text(query, max_results=max_results):
            results.append({"title": r["title"], "snippet": r["body"], "url": r["href"]})
        return results
```

**backend/app/agents/tools/content_tools.py:**
```python
from app.agents.router import generate


HUMANIZE_PROMPT = """Rewrite the following resume content to sound more human and natural. 
Remove any AI-sounding phrases, buzzwords, and clichés. Keep all factual information.
Use active voice and strong action verbs. Make it sound like a real person wrote it.

Original:
{content}

Rewritten version:"""


async def humanize_text(content: str) -> str:
    response = await generate(
        messages=[{"role": "user", "content": HUMANIZE_PROMPT.format(content=content)}],
        model="gpt-4o-mini",
        temperature=0.7,
    )
    return response


async def suggest_improvements(content: str) -> str:
    prompt = f"""Analyze this resume content and suggest specific improvements:
- Add quantifiable achievements where missing
- Suggest stronger action verbs
- Identify and remove clichés
- Recommend restructuring for impact

Content: {content}

Suggestions:"""
    response = await generate(
        messages=[{"role": "user", "content": prompt}],
        model="gpt-4o-mini",
        temperature=0.5,
    )
    return response
```

**backend/app/agents/tools/resume_tools.py:**
```python
from typing import Any


async def get_section_info(resume: Any, section_type: str) -> dict | None:
    for section in resume.content.get("sections", []):
        if section["type"] == section_type:
            return section
    return None


async def update_section(resume: Any, section_type: str, items: list[dict]) -> Any:
    for i, section in enumerate(resume.content.get("sections", [])):
        if section["type"] == section_type:
            resume.content["sections"][i]["items"] = items
            break
    return resume
```

### 4.9 PDF Service

**backend/app/services/pdf_service.py:**
```python
import tempfile
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

from app.repositories.resume_repo import ResumeRepository


HTML_TEMPLATE = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { margin: {{ styles.margins|default('20mm') }}; }
    body { font-family: {{ styles.fonts.body|default('Inter') }}, sans-serif; 
           color: {{ styles.color_scheme.text|default('#1a202c') }};
           background: {{ styles.color_scheme.background|default('#ffffff') }}; }
    h1, h2, h3 { font-family: {{ styles.fonts.heading|default('Inter') }}, sans-serif;
                  color: {{ styles.color_scheme.primary|default('#1a365d') }}; }
    .section { margin-bottom: {{ styles.spacing.section|default('16px') }}; }
    .item { margin-bottom: {{ styles.spacing.item|default('8px') }}; }
    .bullet-point { margin-left: 16px; }
  </style>
</head>
<body>
  {% for section in sections %}
  <div class="section">
    {% if section.type == 'header' %}
      {% for item in section.items %}
      <h1>{{ item.full_name }}</h1>
      {% if item.headline %}<p class="headline">{{ item.headline }}</p>{% endif %}
      <p>{{ item.email }} | {{ item.phone }} | {{ item.location }}</p>
      {% endfor %}
    {% elif section.type == 'summary' %}
      {% for item in section.items %}
      <p>{{ item.content }}</p>
      {% endfor %}
    {% elif section.type in ('experience', 'education', 'projects') %}
      {% for item in section.items %}
      <div class="item">
        <h3>{{ item.position or item.degree or item.title }}</h3>
        <p>{{ item.company or item.institution }}</p>
        {% if item.start_date %}<p class="date">{{ item.start_date }} - {{ item.end_date or 'Present' }}</p>{% endif %}
        {% if item.bullets %}
        <ul>
          {% for bullet in item.bullets %}
          <li class="bullet-point">{{ bullet }}</li>
          {% endfor %}
        </ul>
        {% endif %}
      </div>
      {% endfor %}
    {% elif section.type == 'skills' %}
      {% for item in section.items %}
      <p><strong>{{ item.category }}:</strong> {{ item.skills | join(', ') }}</p>
      {% endfor %}
    {% elif section.type == 'certifications' %}
      {% for item in section.items %}
      <div class="item">
        <p><strong>{{ item.name }}</strong> - {{ item.issuer }} ({{ item.date }})</p>
      </div>
      {% endfor %}
    {% elif section.type == 'languages' %}
      <p>{{ section.items | map(attribute='language') | join(', ') }}</p>
    {% endif %}
  </div>
  {% endfor %}
</body>
</html>"""


class PdfService:
    def __init__(self, resume_repo: ResumeRepository):
        self.resume_repo = resume_repo

    async def generate_pdf(self, resume_id: str) -> bytes:
        resume = await self.resume_repo.get_by_id(resume_id)
        if not resume:
            raise ValueError("Resume not found")

        # Render HTML
        template = Environment().from_string(HTML_TEMPLATE)
        html_content = template.render(
            sections=resume.content.get("sections", []),
            styles=resume.styles,
        )

        # Generate PDF with Playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.set_content(html_content, wait_until="networkidle")
            
            pdf_bytes = await page.pdf(
                format="A4",
                print_background=True,
                margin={
                    "top": resume.styles.get("margins", {}).get("top", "20mm"),
                    "bottom": resume.styles.get("margins", {}).get("bottom", "20mm"),
                    "left": resume.styles.get("margins", {}).get("left", "20mm"),
                    "right": resume.styles.get("margins", {}).get("right", "20mm"),
                },
            )
            await browser.close()

        return pdf_bytes
```

### 4.10 FastAPI Application Entry

**backend/app/main.py:**
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import auth, templates, resumes, studio, chat, pdf


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(studio.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(pdf.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## 5. Frontend Implementation (Next.js)

### 5.1 Package Dependencies

**frontend/package.json:**
```json
{
  "name": "craftcv-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.46.0",
    "@supabase/ssr": "^0.5.0",
    "@tanstack/react-query": "^5.60.0",
    "zustand": "^5.0.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.0",
    "@tiptap/react": "^2.9.0",
    "@tiptap/starter-kit": "^2.9.0",
    "@tiptap/extension-placeholder": "^2.9.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "class-variance-authority": "^0.7.0",
    "date-fns": "^4.1.0",
    "sonner": "^1.7.0",
    "react-hot-toast": "^2.4.1",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "@tailwindcss/typography": "^0.5.0"
  }
}
```

### 5.2 Supabase Client

**frontend/src/lib/supabase.ts:**
```typescript
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
```

### 5.3 API Client

**frontend/src/lib/api.ts:**
```typescript
import { supabase } from "./supabase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
```

### 5.4 Types

**frontend/src/types/template.ts:**
```typescript
export interface TemplateField {
  type: "text" | "url" | "date" | "boolean" | "richtext" | "list" | "tags" | "select";
  label: string;
  required?: boolean;
  max_length?: number;
  min?: number;
  max?: number;
  options?: string[];
}

export interface SectionDefinition {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  min_items?: number;
  max_items?: number;
  fields: Record<string, TemplateField>;
}

export interface LayoutDefinition {
  columns: number;
  color_scheme: Record<string, string>;
  fonts: Record<string, string>;
}

export interface TemplateDefinition {
  sections: SectionDefinition[];
  layout: LayoutDefinition;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  is_public: boolean;
  definition: TemplateDefinition;
  default_styles: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

**frontend/src/types/resume.ts:**
```typescript
export interface SectionItemData {
  section_id: string;
  type: string;
  items: Record<string, unknown>[];
}

export interface ResumeContent {
  sections: SectionItemData[];
}

export interface Resume {
  id: string;
  template_id: string;
  title: string;
  content: ResumeContent;
  styles: Record<string, unknown>;
  status: "draft" | "complete";
  created_at: string;
  updated_at: string;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetState {
  id: string;
  sectionId: string;
  type: string;
  items: Record<string, unknown>[];
  position: WidgetPosition;
  width: number;
  styles: Record<string, unknown>;
}

export interface StudioState {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  globalStyles: Record<string, unknown>;
}
```

**frontend/src/types/chat.ts:**
```typescript
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  resume_id: string;
  mode: "guided" | "free";
  progress: Record<string, unknown>;
}

export interface SectionProgress {
  sectionId: string;
  label: string;
  completed: boolean;
  itemCount: number;
}
```

### 5.5 Studio Store (Zustand)

**frontend/src/stores/studio-store.ts:**
```typescript
import { create } from "zustand";
import { WidgetState } from "@/types/resume";

interface StudioStore {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  globalStyles: Record<string, unknown>;
  history: WidgetState[][];
  historyIndex: number;

  // Actions
  setWidgets: (widgets: WidgetState[]) => void;
  selectWidget: (id: string | null) => void;
  updateWidgetPosition: (id: string, x: number, y: number) => void;
  updateWidgetStyles: (id: string, styles: Record<string, unknown>) => void;
  updateWidgetContent: (id: string, items: Record<string, unknown>[]) => void;
  updateGlobalStyles: (styles: Record<string, unknown>) => void;
  addWidget: (widget: WidgetState) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  widgets: [],
  selectedWidgetId: null,
  globalStyles: {},
  history: [],
  historyIndex: -1,

  setWidgets: (widgets) => set({ widgets }),

  selectWidget: (id) => set({ selectedWidgetId: id }),

  updateWidgetPosition: (id, x, y) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, position: { x, y } } : w
      ),
    }));
  },

  updateWidgetStyles: (id, styles) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, styles: { ...w.styles, ...styles } } : w
      ),
    }));
  },

  updateWidgetContent: (id, items) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, items } : w
      ),
    }));
  },

  updateGlobalStyles: (styles) => {
    get().pushHistory();
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    }));
  },

  addWidget: (widget) => {
    get().pushHistory();
    set((state) => ({ widgets: [...state.widgets, widget] }));
  },

  removeWidget: (id) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      selectedWidgetId:
        state.selectedWidgetId === id ? null : state.selectedWidgetId,
    }));
  },

  reorderWidgets: (fromIndex, toIndex) => {
    get().pushHistory();
    set((state) => {
      const widgets = [...state.widgets];
      const [removed] = widgets.splice(fromIndex, 1);
      widgets.splice(toIndex, 0, removed);
      return { widgets };
    });
  },

  pushHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.widgets)));
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        widgets: JSON.parse(JSON.stringify(history[historyIndex - 1])),
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        widgets: JSON.parse(JSON.stringify(history[historyIndex + 1])),
        historyIndex: historyIndex + 1,
      });
    }
  },
}));
```

### 5.6 Studio Canvas Component

**frontend/src/components/studio/Canvas.tsx:**
```tsx
"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Widget } from "./Widget";
import { SectionPicker } from "./SectionPicker";
import { useStudioStore } from "@/stores/studio-store";

export function Canvas() {
  const { widgets, reorderWidgets, selectWidget, selectedWidgetId } =
    useStudioStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = widgets.findIndex((w) => w.id === active.id);
        const newIndex = widgets.findIndex((w) => w.id === over.id);
        reorderWidgets(oldIndex, newIndex);
      }
    },
    [widgets, reorderWidgets]
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div
        className="mx-auto bg-white shadow-lg min-h-[1056px] w-[816px] relative p-12"
        onClick={() => selectWidget(null)}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            {widgets.map((widget) => (
              <Widget
                key={widget.id}
                widget={widget}
                isSelected={selectedWidgetId === widget.id}
              />
            ))}
          </SortableContext>
        </DndContext>

        {widgets.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a template or add sections to get started
          </div>
        )}
      </div>

      <SectionPicker />
    </div>
  );
}
```

### 5.7 Widget Component

**frontend/src/components/studio/Widget.tsx:**
```tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { WidgetState } from "@/types/resume";
import { useStudioStore } from "@/stores/studio-store";
import { HeaderWidget } from "./widgets/HeaderWidget";
import { ExperienceWidget } from "./widgets/ExperienceWidget";
import { SummaryWidget } from "./widgets/SummaryWidget";
import { SkillsWidget } from "./widgets/SkillsWidget";
import { ProjectsWidget } from "./widgets/ProjectsWidget";
import { EducationWidget } from "./widgets/EducationWidget";

const widgetComponents: Record<string, React.FC<{ items: Record<string, unknown>[] }>> = {
  header: HeaderWidget,
  summary: SummaryWidget,
  experience: ExperienceWidget,
  education: EducationWidget,
  skills: SkillsWidget,
  projects: ProjectsWidget,
};

interface WidgetProps {
  widget: WidgetState;
  isSelected: boolean;
}

export function Widget({ widget, isSelected }: WidgetProps) {
  const { selectWidget, removeWidget, updateWidgetContent } = useStudioStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = widgetComponents[widget.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg mb-4 p-4 transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-200"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        selectWidget(widget.id);
      }}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      {/* Widget Toolbar */}
      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 flex gap-1 bg-white border rounded-md shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeWidget(widget.id);
          }}
          className="p-1 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      {/* Widget Content */}
      {Component ? (
        <Component items={widget.items} />
      ) : (
        <div className="text-gray-400 text-sm">
          Unknown section type: {widget.type}
        </div>
      )}
    </div>
  );
}
```

### 5.8 Widget Implementations

**frontend/src/components/studio/widgets/HeaderWidget.tsx:**
```tsx
"use client";

interface HeaderWidgetProps {
  items: Record<string, unknown>[];
}

export function HeaderWidget({ items }: HeaderWidgetProps) {
  const data = items[0] || {};

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        {String(data.full_name || "")}
      </h1>
      {data.headline && (
        <p className="text-lg text-gray-600 mt-1">{String(data.headline)}</p>
      )}
      <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
        {data.email && <span>{String(data.email)}</span>}
        {data.phone && <span>{String(data.phone)}</span>}
        {data.location && <span>{String(data.location)}</span>}
      </div>
    </div>
  );
}
```

**frontend/src/components/studio/widgets/ExperienceWidget.tsx:**
```tsx
"use client";

import { Briefcase } from "lucide-react";

interface ExperienceWidgetProps {
  items: Record<string, unknown>[];
}

export function ExperienceWidget({ items }: ExperienceWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2">
        <Briefcase className="w-4 h-4" /> Experience
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No experience added yet</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {String(item.position || "")}
              </h3>
              <p className="text-gray-600 text-sm">{String(item.company || "")}</p>
            </div>
            {item.start_date && (
              <span className="text-sm text-gray-400">
                {String(item.start_date)} - {item.current ? "Present" : String(item.end_date || "")}
              </span>
            )}
          </div>
          {item.bullets && Array.isArray(item.bullets) && (
            <ul className="mt-1 list-disc list-inside text-sm text-gray-600 space-y-0.5">
              {(item.bullets as string[]).map((bullet, bi) => (
                <li key={bi}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
```

**frontend/src/components/studio/widgets/SkillsWidget.tsx:**
```tsx
"use client";

interface SkillsWidgetProps {
  items: Record<string, unknown>[];
}

export function SkillsWidget({ items }: SkillsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Skills
      </h2>
      <div className="flex flex-wrap gap-4">
        {items.map((item, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-medium text-gray-700">
              {String(item.category || "")}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {(item.skills as string[] || []).map((skill, si) => (
                <span
                  key={si}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.9 Style Panel

**frontend/src/components/studio/StylePanel.tsx:**
```tsx
"use client";

import { useStudioStore } from "@/stores/studio-store";

export function StylePanel() {
  const { selectedWidgetId, widgets, globalStyles, updateWidgetStyles, updateGlobalStyles } =
    useStudioStore();

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">
        Styles
      </h3>

      {/* Global Styles */}
      {!selectedWidget && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={String(globalStyles.primary_color || "#1a365d")}
              onChange={(e) =>
                updateGlobalStyles({ primary_color: e.target.value })
              }
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading Font
            </label>
            <select
              value={String(globalStyles.heading_font || "Inter")}
              onChange={(e) =>
                updateGlobalStyles({ heading_font: e.target.value })
              }
              className="w-full rounded border p-1.5 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body Font
            </label>
            <select
              value={String(globalStyles.body_font || "Inter")}
              onChange={(e) =>
                updateGlobalStyles({ body_font: e.target.value })
              }
              className="w-full rounded border p-1.5 text-sm"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-500">Top</span>
                <input
                  type="number"
                  value={String(globalStyles.margin_top || 20)}
                  onChange={(e) =>
                    updateGlobalStyles({ margin_top: Number(e.target.value) })
                  }
                  className="w-full rounded border p-1 text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500">Bottom</span>
                <input
                  type="number"
                  value={String(globalStyles.margin_bottom || 20)}
                  onChange={(e) =>
                    updateGlobalStyles({ margin_bottom: Number(e.target.value) })
                  }
                  className="w-full rounded border p-1 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget-specific Styles */}
      {selectedWidget && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={Number(selectedWidget.styles.padding || 16)}
              onChange={(e) =>
                updateWidgetStyles(selectedWidget.id, {
                  padding: Number(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <input
              type="color"
              value={String(selectedWidget.styles.background || "#ffffff")}
              onChange={(e) =>
                updateWidgetStyles(selectedWidget.id, {
                  background: e.target.value,
                })
              }
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5.10 Chat Panel

**frontend/src/components/chat/ChatPanel.tsx:**
```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Search, Sparkles, MessageSquare } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { SectionProgress } from "./SectionProgress";
import { QuickActions } from "./QuickActions";
import { api } from "@/lib/api";
import { Message } from "@/types/chat";

interface ChatPanelProps {
  resumeId: string;
}

export function ChatPanel({ resumeId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mode, setMode] = useState<"guided" | "free">("guided");
  const [progress, setProgress] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConversation();
  }, [resumeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function initializeConversation() {
    try {
      const data = await api.post<{
        conversation_id: string;
        mode: string;
        progress: Record<string, unknown>;
      }>(`/chat/conversation/${resumeId}`);
      setConversationId(data.conversation_id);
      setMode(data.mode as "guided" | "free");
      setProgress(data.progress);

      // Add initial system message
      setMessages([
        {
          id: "system-1",
          role: "assistant",
          content:
            mode === "guided"
              ? "I'll help you build your resume step by step. Let's start with your header — what's your full name?"
              : "I'm here to help you build your resume. What would you like to work on?",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to initialize conversation:", err);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await api.post<{ content: string; role: string }>(
        `/chat/message/${conversationId}`,
        { content: input }
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function switchMode() {
    if (!conversationId) return;
    const newMode = mode === "guided" ? "free" : "guided";
    try {
      await api.post(`/chat/switch-mode/${conversationId}`, { mode: newMode });
      setMode(newMode);
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "assistant",
          content:
            newMode === "guided"
              ? "Switched to guided mode. I'll ask about each section one at a time."
              : "Switched to free mode. Ask me anything about your resume.",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Failed to switch mode:", err);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm">Resume Assistant</span>
        </div>
        <button
          onClick={switchMode}
          className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50 transition-colors"
        >
          {mode === "guided" ? "Guided" : "Free"} mode
        </button>
      </div>

      {/* Progress */}
      <SectionProgress progress={progress} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={(action) => setInput(action)} />

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              mode === "guided"
                ? "Answer the question above..."
                : "Ask me anything about your resume..."
            }
            className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={() => setInput("Search the web for latest resume trends")}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Web search"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5.11 Dashboard Page

**frontend/src/app/(dashboard)/page.tsx:**
```tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { Resume } from "@/types/resume";
import Link from "next/link";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const data = await api.get<Resume[]>("/resumes/");
      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <Link
          href="/dashboard/templates"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            No resumes yet
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Choose a template to get started
          </p>
          <Link
            href="/dashboard/templates"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Link
              key={resume.id}
              href={`/studio/${resume.id}`}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">{resume.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {resume.status === "draft" ? "Draft" : "Complete"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5.12 Studio Page

**frontend/src/app/studio/[resumeId]/page.tsx:**
```tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Save, Undo2, Redo2, Eye, Download } from "lucide-react";
import { Canvas } from "@/components/studio/Canvas";
import { StylePanel } from "@/components/studio/StylePanel";
import { useStudioStore } from "@/stores/studio-store";
import { api } from "@/lib/api";
import { Resume } from "@/types/resume";

function buildWidgetsFromResume(resume: Resume) {
  return resume.content.sections.map((section, index) => ({
    id: section.section_id,
    sectionId: section.section_id,
    type: section.type,
    items: section.items,
    position: { x: 0, y: index * 100 },
    width: 100,
    styles: {},
  }));
}

export default function StudioPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;
  const { setWidgets, widgets, undo, redo, globalStyles } = useStudioStore();

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  async function loadResume() {
    try {
      const resume = await api.get<Resume>(`/resumes/${resumeId}`);
      setWidgets(buildWidgetsFromResume(resume));
    } catch (err) {
      console.error("Failed to load resume:", err);
    }
  }

  async function saveResume() {
    try {
      const sections = widgets.map((w) => ({
        section_id: w.sectionId,
        type: w.type,
        items: w.items,
      }));

      await api.patch(`/resumes/${resumeId}`, {
        content: { sections },
        styles: globalStyles,
      });
    } catch (err) {
      console.error("Failed to save:", err);
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveResume}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        <Canvas />
        <StylePanel />
      </div>
    </div>
  );
}
```

### 5.13 Auth Context

**frontend/src/hooks/useAuth.ts:**
```typescript
"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}
```

### 5.14 Root Layout

**frontend/src/app/layout.tsx:**
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CraftCV - Resume Builder",
  description: "Create professional CVs and resumes with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 5.15 Global CSS

**frontend/src/app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}
```

---

## 6. Docker Compose

```yaml
version: "3.9"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - redis
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  playwright:
    image: mcr.microsoft.com/playwright:v1.49.0
    entrypoint: ["sleep", "infinity"]
```

---

## 7. Implementation Phases

### Phase 1: Foundation (3 days)
**Goal**: Project scaffolding, Docker, Supabase schema, Auth

Files to create:
- `docker-compose.yml`
- `backend/pyproject.toml`, `backend/Dockerfile`, `backend/.env.example`
- `backend/app/main.py`, `backend/app/core/config.py`, `backend/app/core/database.py`, `backend/app/core/security.py`, `backend/app/core/dependencies.py`
- `backend/app/models/__init__.py`, `backend/app/models/user.py`, `backend/app/models/template.py`, `backend/app/models/resume.py`, `backend/app/models/conversation.py`
- `backend/app/repositories/base.py`, `backend/app/repositories/user_repo.py`, `backend/app/repositories/template_repo.py`, `backend/app/repositories/resume_repo.py`, `backend/app/repositories/conversation_repo.py`
- `backend/app/schemas/auth.py`, `backend/app/api/v1/auth.py`, `backend/app/services/auth_service.py`
- `backend/alembic.ini`, `backend/alembic/env.py`
- `frontend/package.json`, `frontend/next.config.ts`, `frontend/tailwind.config.ts`, `frontend/tsconfig.json`, `frontend/components.json`
- `frontend/src/lib/supabase.ts`, `frontend/src/lib/api.ts`
- `frontend/src/app/layout.tsx`, `frontend/src/app/globals.css`
- `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/signup/page.tsx`
- `frontend/src/hooks/useAuth.ts`

Commands:
```bash
# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
playwright install chromium
alembic init alembic && alembic revision --autogenerate -m "init" && alembic upgrade head

# Frontend
cd frontend && npx create-next-app@latest . --typescript --tailwind --eslint --app
npx shadcn@latest init
npx shadcn@latest add button card input label dialog dropdown-menu tabs select slider switch

# Start
docker compose up -d
```

### Phase 2: Templates (3 days)
**Goal**: Template JSON schema, CRUD, Seed templates, Template browser UI

Files to create:
- `backend/app/schemas/template.py`
- `backend/app/api/v1/templates.py`
- `backend/app/services/template_service.py`
- `frontend/src/types/template.ts`
- `frontend/src/app/(dashboard)/templates/page.tsx`
- `frontend/src/app/(dashboard)/templates/[id]/page.tsx`
- `frontend/src/components/templates/TemplateCard.tsx`
- `frontend/src/components/templates/TemplateGrid.tsx`
- `frontend/src/components/templates/TemplatePreview.tsx`
- `frontend/src/hooks/useTemplates.ts`

Key task: Seed 3 predefined templates as JSONB migration.

### Phase 3: Studio Editor (5 days)
**Goal**: Canvas with dnd-kit, Widget system, Style panel, Undo/redo

Files to create:
- `frontend/src/stores/studio-store.ts`
- `frontend/src/types/resume.ts`
- `frontend/src/hooks/useStudio.ts`
- `frontend/src/components/studio/Canvas.tsx`
- `frontend/src/components/studio/Widget.tsx`
- `frontend/src/components/studio/WidgetToolbar.tsx`
- `frontend/src/components/studio/StylePanel.tsx`
- `frontend/src/components/studio/SectionPicker.tsx`
- `frontend/src/components/studio/widgets/HeaderWidget.tsx`
- `frontend/src/components/studio/widgets/SummaryWidget.tsx`
- `frontend/src/components/studio/widgets/ExperienceWidget.tsx`
- `frontend/src/components/studio/widgets/EducationWidget.tsx`
- `frontend/src/components/studio/widgets/SkillsWidget.tsx`
- `frontend/src/components/studio/widgets/ProjectsWidget.tsx`
- `frontend/src/components/studio/widgets/CertificationsWidget.tsx`
- `frontend/src/components/studio/widgets/LanguagesWidget.tsx`
- `frontend/src/components/studio/widgets/CustomWidget.tsx`
- `frontend/src/app/studio/[resumeId]/page.tsx`
- `backend/app/api/v1/resumes.py`
- `backend/app/api/v1/studio.py`
- `backend/app/services/resume_service.py`
- `backend/app/services/studio_service.py`
- `backend/app/schemas/resume.py`

### Phase 4: AI Chat (4 days)
**Goal**: LiteLLM router, CvAgent, Guided/free flow, Web search

Files to create:
- `backend/app/agents/router.py`
- `backend/app/agents/cv_agent.py`
- `backend/app/agents/tools/web_search.py`
- `backend/app/agents/tools/resume_tools.py`
- `backend/app/agents/tools/content_tools.py`
- `backend/app/agents/prompts/system.md`
- `backend/app/agents/prompts/sections.py`
- `backend/app/api/v1/chat.py`
- `backend/app/services/chat_service.py`
- `backend/app/schemas/chat.py`
- `frontend/src/types/chat.ts`
- `frontend/src/stores/chat-store.ts`
- `frontend/src/hooks/useChat.ts`
- `frontend/src/components/chat/ChatPanel.tsx`
- `frontend/src/components/chat/MessageBubble.tsx`
- `frontend/src/components/chat/ChatInput.tsx`
- `frontend/src/components/chat/GuidedFlowIndicator.tsx`
- `frontend/src/components/chat/QuickActions.tsx`
- `frontend/src/components/chat/SectionProgress.tsx`
- `frontend/src/app/chat/[resumeId]/page.tsx`

### Phase 5: Integration (3 days)
**Goal**: Chat ↔ Studio sync, Live preview updates

Key work:
- Chat panel embedded in Studio page (split view)
- WebSocket or polling for real-time content sync
- "Edit in Studio" button from chat
- "Apply changes from chat" in studio
- Live preview reconciliation

Files to modify:
- `frontend/src/app/studio/[resumeId]/page.tsx` (add chat panel)
- `frontend/src/components/studio/Canvas.tsx` (accept updates from chat)
- `frontend/src/components/chat/ChatPanel.tsx` (trigger studio updates)

### Phase 6: PDF Output (2 days)
**Goal**: HTML rendering, Playwright PDF gen, Download

Files to create:
- `backend/app/services/pdf_service.py`
- `backend/app/api/v1/pdf.py`
- `frontend/src/components/resume/ResumePreview.tsx`
- `frontend/src/app/resume/[resumeId]/preview/page.tsx`

### Phase 7: Polish (3 days)
**Goal**: Responsive, error states, loading, edge cases

Files to create/modify:
- Error boundaries
- Loading skeletons
- Empty states
- Form validation
- Responsive layouts
- SEO metadata
- Performance optimization

---

## 8. Environment Variables

**backend/.env.example:**
```env
APP_NAME=CraftCV
DEBUG=true

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/craftcv

JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256

OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

REDIS_URL=redis://localhost:6379/0

STORAGE_BUCKET=resumes
PDF_STORAGE_PATH=pdfs
```

**frontend/.env.local.example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 9. API Endpoints Summary

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/signin` | Login user |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/templates/` | List public templates |
| GET | `/api/v1/templates/{id}` | Get template details |
| POST | `/api/v1/templates/` | Create custom template |
| GET | `/api/v1/resumes/` | List user resumes |
| POST | `/api/v1/resumes/` | Create resume from template |
| GET | `/api/v1/resumes/{id}` | Get resume details |
| PATCH | `/api/v1/resumes/{id}` | Update resume |
| DELETE | `/api/v1/resumes/{id}` | Delete resume |
| PUT | `/api/v1/studio/{id}/content` | Update resume content |
| PUT | `/api/v1/studio/{id}/styles` | Update resume styles |
| POST | `/api/v1/chat/conversation/{resume_id}` | Start/get conversation |
| POST | `/api/v1/chat/message/{conversation_id}` | Send message |
| POST | `/api/v1/chat/switch-mode/{conversation_id}` | Toggle guided/free |
| GET | `/api/v1/chat/messages/{conversation_id}` | Get message history |
| POST | `/api/v1/pdf/generate/{resume_id}` | Generate PDF |
| GET | `/api/v1/pdf/download/{resume_id}` | Download PDF |

---

## 10. Architecture & Design Principles

### SOLID Applied

**S**ingle Responsibility: Each service/repository has one job. `TemplateService` only handles template logic. `CvAgent` only handles AI conversation.

**O**pen/Closed: New section types extend `widgets/` without modifying Canvas. New LLM providers add to LiteLLM router config.

**L**iskov: Repository base class ensures all repos follow same interface.

**I**nterface Segregation: `BaseRepository<Profile>` vs `BaseRepository<Template>` — typed generics.

**D**ependency Injection: FastAPI `Depends()` injects repos and services into routes.

### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic isolated from HTTP
- **Dependency Injection**: Decoupled components
- **Observer (Zustand)**: State changes propagate to widgets
- **Strategy**: Guided vs free-form chat modes
- **Facade**: `CvAgent.process()` wraps tool routing, intent detection
- **Memento**: Undo/redo via history stack in Zustand

### Data Flow

```
User Action → Component → Zustand Action → API Call → Backend Route
                                                              ↓
Backend Route → Schema Validation → Service → Repository → Database
                                              ↕
                                           AI Agent
                                              ↕
                                         LiteLLM Router
                                              ↕
                                      OpenAI/Anthropic/Google
```

---

## 11. Seeding Predefined Templates

Create an Alembic migration or seed script with 3 templates:

1. **Modern Clean** — Single column, blue accent, Inter font, all standard sections
2. **Executive** — Dark header, serif fonts, summary-focused, certifications
3. **Creative** — Two-column layout, colorful accents, skills sidebar, projects focus

Each seeded as `is_public=True`, `user_id=NULL`.

---

## 12. Testing Strategy

### Backend
- Unit tests per service (pytest + pytest-asyncio)
- Integration tests with test database
- API endpoint tests with httpx AsyncClient

### Frontend
- Component tests with Vitest + React Testing Library
- Store tests for Zustand
- Integration: Playwright E2E for critical flows

---

## 13. Deployment

### Production Docker Compose
```yaml
services:
  backend:
    build: ./backend
    restart: always
    environment:
      - DATABASE_URL=postgresql+asyncpg://...  # Supabase direct connection
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

  frontend:
    build: ./frontend
    restart: always
    environment:
      - NEXT_PUBLIC_API_URL=https://api.craftcv.com/api/v1
```

### Supabase
- Use Supabase hosted PostgreSQL
- Supabase Auth for authentication
- Supabase Storage for template thumbnails and PDFs
- Row Level Security (RLS) on all tables
