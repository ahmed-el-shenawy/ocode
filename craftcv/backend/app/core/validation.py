import json
import logging
import os
from dataclasses import dataclass, field

import jsonschema

logger = logging.getLogger("craftcv.validation")


@dataclass
class ValidationResult:
    is_valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


class BaseSchemaValidator:
    def __init__(self, schema_path: str, name: str = "base"):
        self.name = name
        with open(schema_path) as f:
            self.schema = json.load(f)

    def validate(self, instance: dict) -> ValidationResult:
        validator = jsonschema.Draft7Validator(self.schema)
        errors = [e.message for e in validator.iter_errors(instance)]
        result = ValidationResult(is_valid=len(errors) == 0, errors=errors)
        logger.info(
            "Validation %s for %s: %d error(s), %d warning(s)",
            "PASS" if result.is_valid else "FAIL",
            self.name,
            len(result.errors),
            len(result.warnings),
        )
        return result


class TemplateSchemaValidator(BaseSchemaValidator):
    def __init__(self):
        path = os.path.join(
            os.path.dirname(__file__),
            "contracts",
            "template-definition-schema.json",
        )
        super().__init__(path, name="template-definition")


class ResumeContentValidator(BaseSchemaValidator):
    def __init__(self):
        path = os.path.join(
            os.path.dirname(__file__),
            "contracts",
            "resume-content-schema.json",
        )
        super().__init__(path, name="resume-content")
