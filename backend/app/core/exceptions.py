from typing import Any, Dict, Optional
from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from app.core.logging import logger


class APIException(HTTPException):
    """Base API Exception for structured error payloads"""

    def __init__(
        self,
        status_code: int,
        message: str,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Any] = None,
    ):
        super().__init__(status_code=status_code, detail=message)
        self.message = message
        self.error_code = error_code
        self.details = details


class AuthenticationError(APIException):
    def __init__(self, message: str = "Authentication required or invalid token", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            error_code="UNAUTHORIZED",
            details=details,
        )


class PermissionDeniedError(APIException):
    def __init__(self, message: str = "Operation not permitted for your user role", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            error_code="FORBIDDEN",
            details=details,
        )


class NotFoundError(APIException):
    def __init__(self, message: str = "Requested resource not found", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            error_code="NOT_FOUND",
            details=details,
        )


class ExternalAPIError(APIException):
    def __init__(self, service: str, message: str, details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            message=f"External service '{service}' error: {message}",
            error_code="EXTERNAL_SERVICE_ERROR",
            details=details,
        )


class ValidationErrorException(APIException):
    def __init__(self, message: str = "Invalid parameters provided", details: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            error_code="VALIDATION_ERROR",
            details=details,
        )


async def api_exception_handler(request: Request, exc: APIException) -> JSONResponse:
    logger.warning(
        f"APIException [{exc.status_code}] {exc.error_code}: {exc.message} on {request.method} {request.url.path}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            },
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected internal server error occurred.",
                "details": str(exc) if exc else None,
            },
        },
    )
