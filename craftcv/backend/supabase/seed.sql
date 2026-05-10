-- seed.sql
-- Optional seed data for local development

-- Public templates (system templates owned by NULL user_id)
INSERT INTO public.templates (name, description, is_public, definition, default_styles) VALUES
(
    'Modern Professional',
    'A clean, modern resume template with a professional blue accent color scheme. Suitable for most industries.',
    TRUE,
    '{
        "sections": [
            {"key": "header", "label": "Header", "fields": [{"key": "full_name", "label": "Full Name", "type": "text", "required": true}, {"key": "title", "label": "Professional Title", "type": "text"}, {"key": "email", "label": "Email", "type": "text"}, {"key": "phone", "label": "Phone", "type": "text"}, {"key": "location", "label": "Location", "type": "text"}, {"key": "linkedin", "label": "LinkedIn URL", "type": "text"}]},
            {"key": "summary", "label": "Professional Summary", "fields": [{"key": "content", "label": "Summary", "type": "textarea"}]},
            {"key": "experience", "label": "Experience", "fields": [{"key": "company", "label": "Company", "type": "text", "required": true}, {"key": "title", "label": "Job Title", "type": "text", "required": true}, {"key": "start_date", "label": "Start Date", "type": "text"}, {"key": "end_date", "label": "End Date", "type": "text"}, {"key": "description", "label": "Description", "type": "textarea"}]},
            {"key": "education", "label": "Education", "fields": [{"key": "institution", "label": "Institution", "type": "text"}, {"key": "degree", "label": "Degree", "type": "text"}, {"key": "field", "label": "Field of Study", "type": "text"}, {"key": "graduation_date", "label": "Graduation Date", "type": "text"}]},
            {"key": "skills", "label": "Skills", "fields": [{"key": "items", "label": "Skills", "type": "list"}]}
        ],
        "layout": {"columns": 1, "sections": ["header", "summary", "experience", "education", "skills"]}
    }',
    '{"font": "Inter", "primary_color": "#2563EB", "background": "#FFFFFF", "section_spacing": "24px"}'
),
(
    'Executive',
    'A sophisticated template designed for senior leadership roles with a dark header and refined typography.',
    TRUE,
    '{
        "sections": [
            {"key": "header", "label": "Header", "fields": [{"key": "full_name", "label": "Full Name", "type": "text", "required": true}, {"key": "title", "label": "Executive Title", "type": "text"}, {"key": "email", "label": "Email", "type": "text"}, {"key": "phone", "label": "Phone", "type": "text"}]},
            {"key": "summary", "label": "Executive Summary", "fields": [{"key": "content", "label": "Summary", "type": "textarea"}]},
            {"key": "experience", "label": "Leadership Experience", "fields": [{"key": "company", "label": "Organization", "type": "text"}, {"key": "title", "label": "Title", "type": "text"}, {"key": "start_date", "label": "Start Date", "type": "text"}, {"key": "end_date", "label": "End Date", "type": "text"}, {"key": "description", "label": "Key Achievements", "type": "textarea"}]},
            {"key": "education", "label": "Education", "fields": [{"key": "institution", "label": "Institution", "type": "text"}, {"key": "degree", "label": "Degree", "type": "text"}, {"key": "graduation_date", "label": "Year", "type": "text"}]},
            {"key": "certifications", "label": "Certifications", "fields": [{"key": "items", "label": "Certifications", "type": "list"}]}
        ],
        "layout": {"columns": 1, "sections": ["header", "summary", "experience", "education", "certifications"]}
    }',
    '{"font": "Playfair Display", "primary_color": "#1E293B", "background": "#F8FAFC", "section_spacing": "28px"}'
),
(
    'Creative',
    'A bold, creative template with a sidebar layout. Ideal for design, marketing, and media professionals.',
    TRUE,
    '{
        "sections": [
            {"key": "header", "label": "Header", "fields": [{"key": "full_name", "label": "Full Name", "type": "text", "required": true}, {"key": "title", "label": "Role", "type": "text"}, {"key": "email", "label": "Email", "type": "text"}, {"key": "phone", "label": "Phone", "type": "text"}, {"key": "portfolio", "label": "Portfolio URL", "type": "text"}]},
            {"key": "summary", "label": "About Me", "fields": [{"key": "content", "label": "Bio", "type": "textarea"}]},
            {"key": "experience", "label": "Experience", "fields": [{"key": "company", "label": "Company", "type": "text"}, {"key": "title", "label": "Position", "type": "text"}, {"key": "start_date", "label": "Start Date", "type": "text"}, {"key": "end_date", "label": "End Date", "type": "text"}, {"key": "description", "label": "Highlights", "type": "textarea"}]},
            {"key": "skills", "label": "Expertise", "fields": [{"key": "items", "label": "Skills", "type": "list"}]},
            {"key": "languages", "label": "Languages", "fields": [{"key": "items", "label": "Languages", "type": "list"}]}
        ],
        "layout": {"columns": 2, "sections": ["header", "summary", "experience", "skills", "languages"]}
    }',
    '{"font": "Inter", "primary_color": "#7C3AED", "background": "#FFFFFF", "sidebar_color": "#F3E8FF", "section_spacing": "20px"}'
);
